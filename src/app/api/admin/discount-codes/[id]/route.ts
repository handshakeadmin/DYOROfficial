import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { discountCodeSchema } from "@/lib/validations/discount-code";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: code, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !code) {
    return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
  }

  const { data: affiliateOrders } = await supabase
    .from("affiliate_orders")
    .select("id, order_total, commission_amount, status, created_at")
    .eq("discount_code_id", id)
    .order("created_at", { ascending: false });

  const formattedCode = {
    id: code.id,
    code: code.code,
    discountPercent: Number(code.discount_percent) || 0,
    discountType: code.discount_type,
    isAffiliate: code.is_affiliate,
    affiliateName: code.affiliate_name,
    affiliateEmail: code.affiliate_email,
    commissionPercent: code.commission_percent ? Number(code.commission_percent) : null,
    minOrderAmount: Number(code.min_order_amount) || 0,
    maxUses: code.max_uses,
    currentUses: code.current_uses || 0,
    isActive: code.is_active,
    expiresAt: code.expires_at,
    createdAt: code.created_at,
    updatedAt: code.updated_at,
    affiliateOrders: (affiliateOrders || []).map((o: Record<string, unknown>) => ({
      id: o.id,
      orderTotal: Number(o.order_total) || 0,
      commissionAmount: Number(o.commission_amount) || 0,
      status: o.status,
      createdAt: o.created_at,
    })),
  };

  return NextResponse.json(formattedCode);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
    .neq("id", id)
    .single();

  if (existingCode) {
    return NextResponse.json(
      { error: "Another discount code with this code already exists" },
      { status: 400 }
    );
  }

  const { data: updatedCode, error } = await supabase
    .from("discount_codes")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error || !updatedCode) {
    console.error("Error updating discount code:", error);
    return NextResponse.json(
      { error: "Failed to update discount code" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, code: updatedCode });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: affiliateOrders } = await supabase
    .from("affiliate_orders")
    .select("id")
    .eq("discount_code_id", id)
    .limit(1);

  if (affiliateOrders && affiliateOrders.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete discount code with associated affiliate orders. Deactivate it instead." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("discount_codes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting discount code:", error);
    return NextResponse.json(
      { error: "Failed to delete discount code" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
