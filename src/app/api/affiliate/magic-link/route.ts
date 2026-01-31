import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if this email is associated with an affiliate code
    const { data: affiliateCode, error: affiliateError } = await supabase
      .from("discount_codes")
      .select("id, affiliate_name")
      .eq("affiliate_email", email.toLowerCase())
      .eq("is_affiliate", true)
      .single();

    if (affiliateError || !affiliateCode) {
      return NextResponse.json(
        { error: "No affiliate account found for this email" },
        { status: 404 }
      );
    }

    // Send magic link using Supabase Auth
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: `${request.nextUrl.origin}/affiliate`,
      },
    });

    if (authError) {
      console.error("Magic link error:", authError);
      return NextResponse.json(
        { error: "Failed to send magic link" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
