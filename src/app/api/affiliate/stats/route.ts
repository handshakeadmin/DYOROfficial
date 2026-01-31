import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the affiliate's discount code
    const { data: discountCode, error: codeError } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("affiliate_email", user.email)
      .eq("is_affiliate", true)
      .single();

    if (codeError || !discountCode) {
      return NextResponse.json(
        { error: "Affiliate account not found" },
        { status: 404 }
      );
    }

    // Get affiliate orders with order details
    const { data: affiliateOrders, error: ordersError } = await supabase
      .from("affiliate_orders")
      .select(
        `
        id,
        order_total,
        commission_rate,
        commission_amount,
        status,
        approved_at,
        paid_at,
        created_at,
        orders (
          id,
          order_number
        )
      `
      )
      .eq("discount_code_id", discountCode.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching affiliate orders:", ordersError);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    // Calculate totals
    const totalOrders = affiliateOrders?.length || 0;
    const totalRevenue =
      affiliateOrders?.reduce((sum, o) => sum + (o.order_total || 0), 0) || 0;
    const totalCommission =
      affiliateOrders?.reduce((sum, o) => sum + (o.commission_amount || 0), 0) ||
      0;
    const pendingCommission =
      affiliateOrders
        ?.filter((o) => o.status === "pending")
        .reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0;
    const approvedCommission =
      affiliateOrders
        ?.filter((o) => o.status === "approved")
        .reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0;
    const paidCommission =
      affiliateOrders
        ?.filter((o) => o.status === "paid")
        .reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0;

    // Format recent orders (last 5)
    const recentOrders = (affiliateOrders || []).slice(0, 5).map((order) => ({
      id: order.id,
      orderNumber:
        (order.orders as { order_number?: string })?.order_number || "N/A",
      orderTotal: order.order_total,
      commissionAmount: order.commission_amount,
      status: order.status,
      createdAt: order.created_at,
    }));

    return NextResponse.json({
      affiliateName: discountCode.affiliate_name || "Affiliate",
      code: discountCode.code,
      discountPercent: discountCode.discount_percent,
      commissionPercent: discountCode.commission_percent,
      totalOrders,
      totalRevenue,
      totalCommission,
      pendingCommission,
      approvedCommission,
      paidCommission,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching affiliate stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
