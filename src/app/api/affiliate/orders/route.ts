import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest): Promise<NextResponse> {
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
      .select("id")
      .eq("affiliate_email", user.email)
      .eq("is_affiliate", true)
      .single();

    if (codeError || !discountCode) {
      return NextResponse.json(
        { error: "Affiliate account not found" },
        { status: 404 }
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build query
    let query = supabase
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
      `,
        { count: "exact" }
      )
      .eq("discount_code_id", discountCode.id)
      .order("created_at", { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    // Filter by search if provided (order number)
    let filteredOrders = orders || [];
    if (search) {
      filteredOrders = filteredOrders.filter((order) =>
        (order.orders as { order_number?: string })?.order_number
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Get all orders for summary calculation
    const { data: allOrders } = await supabase
      .from("affiliate_orders")
      .select("commission_amount, status")
      .eq("discount_code_id", discountCode.id);

    const summary = {
      totalCommission:
        allOrders?.reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0,
      pendingCommission:
        allOrders
          ?.filter((o) => o.status === "pending")
          .reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0,
      approvedCommission:
        allOrders
          ?.filter((o) => o.status === "approved")
          .reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0,
      paidCommission:
        allOrders
          ?.filter((o) => o.status === "paid")
          .reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0,
    };

    // Format orders for response
    const formattedOrders = filteredOrders.map((order) => ({
      id: order.id,
      orderNumber:
        (order.orders as { order_number?: string })?.order_number || "N/A",
      orderTotal: order.order_total,
      commissionRate: order.commission_rate,
      commissionAmount: order.commission_amount,
      status: order.status,
      approvedAt: order.approved_at,
      paidAt: order.paid_at,
      createdAt: order.created_at,
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders: formattedOrders,
      total,
      page,
      limit,
      totalPages,
      summary,
    });
  } catch (error) {
    console.error("Error fetching affiliate orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
