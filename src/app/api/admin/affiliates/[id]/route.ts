import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

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

  const { data: affiliate, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("id", id)
    .eq("is_affiliate", true)
    .single();

  if (error || !affiliate) {
    return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
  }

  const { data: orders } = await supabase
    .from("affiliate_orders")
    .select(`
      id,
      order_id,
      order_total,
      commission_rate,
      commission_amount,
      status,
      approved_at,
      paid_at,
      created_at,
      orders!inner(order_number, created_at)
    `)
    .eq("discount_code_id", id)
    .order("created_at", { ascending: false });

  // Calculate totals
  interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    pendingCommission: number;
    approvedCommission: number;
    paidCommission: number;
  }

  const initialStats: OrderStats = {
    totalOrders: 0,
    totalRevenue: 0,
    totalCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
  };

  const stats = (orders || []).reduce(
    (acc: OrderStats, order: { order_total: number | string; commission_amount: number | string; status: string }) => {
      acc.totalOrders += 1;
      acc.totalRevenue += Number(order.order_total) || 0;
      acc.totalCommission += Number(order.commission_amount) || 0;

      switch (order.status) {
        case "pending":
          acc.pendingCommission += Number(order.commission_amount) || 0;
          break;
        case "approved":
          acc.approvedCommission += Number(order.commission_amount) || 0;
          break;
        case "paid":
          acc.paidCommission += Number(order.commission_amount) || 0;
          break;
      }

      return acc;
    },
    initialStats
  );

  const formattedAffiliate = {
    id: affiliate.id,
    code: affiliate.code,
    affiliateName: affiliate.affiliate_name,
    affiliateEmail: affiliate.affiliate_email,
    discountPercent: Number(affiliate.discount_percent) || 0,
    commissionPercent: Number(affiliate.commission_percent) || 0,
    isActive: affiliate.is_active,
    createdAt: affiliate.created_at,
    ...stats,
    orders: (orders || []).map((o: Record<string, unknown>) => ({
      id: o.id,
      orderId: o.order_id,
      orderNumber: (o as unknown as { orders: { order_number: string } }).orders?.order_number,
      orderTotal: Number(o.order_total) || 0,
      commissionRate: Number(o.commission_rate) || 0,
      commissionAmount: Number(o.commission_amount) || 0,
      status: o.status,
      approvedAt: o.approved_at,
      paidAt: o.paid_at,
      createdAt: o.created_at,
    })),
  };

  return NextResponse.json(formattedAffiliate);
}
