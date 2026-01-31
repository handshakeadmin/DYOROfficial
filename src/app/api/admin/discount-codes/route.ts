import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { discountCodeSchema } from "@/lib/validations/discount-code";

export interface AdminDiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  discountType: string;
  isAffiliate: boolean;
  affiliateName: string | null;
  affiliateEmail: string | null;
  commissionPercent: number | null;
  minOrderAmount: number;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const isActive = searchParams.get("isActive");
  const isAffiliate = searchParams.get("isAffiliate");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("discount_codes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `code.ilike.%${search}%,affiliate_name.ilike.%${search}%,affiliate_email.ilike.%${search}%`
    );
  }

  if (isActive === "true") {
    query = query.eq("is_active", true);
  } else if (isActive === "false") {
    query = query.eq("is_active", false);
  }

  if (isAffiliate === "true") {
    query = query.eq("is_affiliate", true);
  } else if (isAffiliate === "false") {
    query = query.eq("is_affiliate", false);
  }

  query = query.range(offset, offset + limit - 1);

  const { data: codes, error, count } = await query;

  if (error) {
    console.error("Error fetching discount codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch discount codes" },
      { status: 500 }
    );
  }

  const formattedCodes: AdminDiscountCode[] = (codes || []).map((c: Record<string, unknown>) => ({
    id: c.id as string,
    code: c.code as string,
    discountPercent: Number(c.discount_percent) || 0,
    discountType: c.discount_type as "percentage" | "fixed",
    isAffiliate: c.is_affiliate as boolean,
    affiliateName: c.affiliate_name as string | null,
    affiliateEmail: c.affiliate_email as string | null,
    commissionPercent: c.commission_percent ? Number(c.commission_percent) : null,
    minOrderAmount: Number(c.min_order_amount) || 0,
    maxUses: c.max_uses as number | null,
    currentUses: (c.current_uses as number) || 0,
    isActive: c.is_active as boolean,
    expiresAt: c.expires_at as string | null,
    createdAt: c.created_at as string,
    updatedAt: c.updated_at as string,
  }));

  return NextResponse.json({
    codes: formattedCodes,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validationResult = discountCodeSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validationResult.error.issues },
      { status: 400 }
    );
  }

  const data = validationResult.data;
  const supabase = await createClient();

  const { data: existingCode } = await supabase
    .from("discount_codes")
    .select("id")
    .eq("code", data.code)
    .single();

  if (existingCode) {
    return NextResponse.json(
      { error: "A discount code with this code already exists" },
      { status: 400 }
    );
  }

  const { data: newCode, error } = await supabase
    .from("discount_codes")
    .insert({
      code: data.code,
      discount_percent: data.discountPercent,
      discount_type: data.discountType,
      is_affiliate: data.isAffiliate,
      affiliate_name: data.affiliateName,
      affiliate_email: data.affiliateEmail,
      commission_percent: data.commissionPercent,
      min_order_amount: data.minOrderAmount,
      max_uses: data.maxUses,
      is_active: data.isActive,
      expires_at: data.expiresAt,
    })
    .select()
    .single();

  if (error || !newCode) {
    console.error("Error creating discount code:", error);
    return NextResponse.json(
      { error: "Failed to create discount code" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, code: newCode });
}
