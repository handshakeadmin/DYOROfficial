import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export interface AffiliateWithStats {
  id: string;
  code: string;
  affiliateName: string;
  affiliateEmail: string | null;
  discountPercent: number;
  commissionPercent: number;
  isActive: boolean;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  // Get affiliate discount codes
  let query = supabase
    .from("discount_codes")
    .select("*", { count: "exact" })
    .eq("is_affiliate", true)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `code.ilike.%${search}%,affiliate_name.ilike.%${search}%,affiliate_email.ilike.%${search}%`
    );
  }

  query = query.range(offset, offset + limit - 1);

  const { data: affiliateCodes, error, count } = await query;

  if (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliates" },
      { status: 500 }
    );
  }

  // Get aggregated stats for each affiliate
  const affiliateIds = (affiliateCodes || []).map((c: { id: string }) => c.id);

  const { data: ordersData } = affiliateIds.length > 0
    ? await supabase
        .from("affiliate_orders")
        .select("discount_code_id, order_total, commission_amount, status")
        .in("discount_code_id", affiliateIds)
    : { data: [] };

  // Calculate stats per affiliate
  const statsMap: Record<string, {
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    pendingCommission: number;
    approvedCommission: number;
    paidCommission: number;
  }> = {};

  (ordersData || []).forEach((order: { discount_code_id: string; order_total: number | string; commission_amount: number | string; status: string }) => {
    if (!statsMap[order.discount_code_id]) {
      statsMap[order.discount_code_id] = {
        totalOrders: 0,
        totalRevenue: 0,
        totalCommission: 0,
        pendingCommission: 0,
        approvedCommission: 0,
        paidCommission: 0,
      };
    }

    const stats = statsMap[order.discount_code_id];
    stats.totalOrders += 1;
    stats.totalRevenue += Number(order.order_total) || 0;
    stats.totalCommission += Number(order.commission_amount) || 0;

    switch (order.status) {
      case "pending":
        stats.pendingCommission += Number(order.commission_amount) || 0;
        break;
      case "approved":
        stats.approvedCommission += Number(order.commission_amount) || 0;
        break;
      case "paid":
        stats.paidCommission += Number(order.commission_amount) || 0;
        break;
    }
  });

  const affiliates: AffiliateWithStats[] = (affiliateCodes || []).map((c: Record<string, unknown>) => ({
    id: c.id as string,
    code: c.code as string,
    affiliateName: (c.affiliate_name as string) || "",
    affiliateEmail: c.affiliate_email as string,
    discountPercent: Number(c.discount_percent) || 0,
    commissionPercent: Number(c.commission_percent) || 0,
    isActive: c.is_active as boolean,
    ...(statsMap[c.id as string] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCommission: 0,
      pendingCommission: 0,
      approvedCommission: 0,
      paidCommission: 0,
    }),
  }));

  return NextResponse.json({
    affiliates,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
