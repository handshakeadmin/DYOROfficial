import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ConvertGuestRequest {
  email: string;
  password: string;
  orderNumber?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ConvertGuestRequest;
    const { email, password, orderNumber } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 400 }
      );
    }

    // Get the most recent order for this guest email to pre-populate profile
    let guestOrderData = null;
    if (orderNumber) {
      const { data: order } = await supabase
        .from("orders")
        .select(`
          shipping_first_name,
          shipping_last_name,
          guest_phone
        `)
        .eq("order_number", orderNumber)
        .eq("guest_email", email.toLowerCase())
        .single();

      guestOrderData = order;
    }

    // Create the user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: guestOrderData?.shipping_first_name || null,
          last_name: guestOrderData?.shipping_last_name || null,
        },
      },
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Link all guest orders with this email to the new user account
    const { error: updateError } = await supabase
      .from("orders")
      .update({ user_id: authData.user.id })
      .eq("guest_email", email.toLowerCase())
      .is("user_id", null);

    if (updateError) {
      console.error("Error linking orders:", updateError);
      // Don't fail the request, the account was created successfully
    }

    // Update user profile with phone if available
    if (guestOrderData?.guest_phone) {
      await supabase
        .from("users")
        .update({ phone: guestOrderData.guest_phone })
        .eq("id", authData.user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      email: authData.user.email,
    });
  } catch (error) {
    console.error("Error converting guest to account:", error);
    return NextResponse.json(
      { error: "An error occurred while creating your account" },
      { status: 500 }
    );
  }
}
