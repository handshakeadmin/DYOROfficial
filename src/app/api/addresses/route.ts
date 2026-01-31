import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface AddressInput {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default?: boolean;
}

// GET - List user's addresses
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: addresses, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching addresses:", error);
      return NextResponse.json(
        { error: "Failed to fetch addresses" },
        { status: 500 }
      );
    }

    return NextResponse.json({ addresses: addresses || [] });
  } catch (error) {
    console.error("Error in addresses API:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

// POST - Create new address
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as AddressInput;

    // Validate required fields
    const requiredFields: (keyof AddressInput)[] = [
      "first_name",
      "last_name",
      "address_line1",
      "city",
      "state",
      "zip_code",
      "country",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field.replace(/_/g, " ")} is required` },
          { status: 400 }
        );
      }
    }

    // If this is the first address or marked as default, unset other defaults
    if (body.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    // Check if user has any addresses
    const { count } = await supabase
      .from("addresses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const isFirstAddress = count === 0;

    const { data: address, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        first_name: body.first_name,
        last_name: body.last_name,
        address_line1: body.address_line1,
        address_line2: body.address_line2 || null,
        city: body.city,
        state: body.state,
        zip_code: body.zip_code,
        country: body.country,
        is_default: body.is_default || isFirstAddress,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating address:", error);
      return NextResponse.json(
        { error: "Failed to create address" },
        { status: 500 }
      );
    }

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Error in addresses API:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

// PUT - Update address
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as AddressInput & { id: string };

    if (!body.id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const { data: existingAddress } = await supabase
      .from("addresses")
      .select("id")
      .eq("id", body.id)
      .eq("user_id", user.id)
      .single();

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    // If marking as default, unset other defaults
    if (body.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", body.id);
    }

    const { data: address, error } = await supabase
      .from("addresses")
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
        address_line1: body.address_line1,
        address_line2: body.address_line2 || null,
        city: body.city,
        state: body.state,
        zip_code: body.zip_code,
        country: body.country,
        is_default: body.is_default,
      })
      .eq("id", body.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating address:", error);
      return NextResponse.json(
        { error: "Failed to update address" },
        { status: 500 }
      );
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error in addresses API:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Get the address to check if it's default
    const { data: existingAddress } = await supabase
      .from("addresses")
      .select("is_default")
      .eq("id", addressId)
      .eq("user_id", user.id)
      .single();

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting address:", error);
      return NextResponse.json(
        { error: "Failed to delete address" },
        { status: 500 }
      );
    }

    // If deleted address was default, set a new default
    if (existingAddress.is_default) {
      const { data: remainingAddresses } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (remainingAddresses && remainingAddresses.length > 0) {
        await supabase
          .from("addresses")
          .update({ is_default: true })
          .eq("id", remainingAddresses[0].id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in addresses API:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
