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
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  // Get orders for this user
  const { data: orders, error, count } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      total,
      status,
      payment_status,
      created_at
    `,
      { count: "exact" }
    )
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orders: (orders || []).map((order: Record<string, unknown>) => ({
      id: order.id,
      orderNumber: order.order_number,
      total: Number(order.total) || 0,
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
    })),
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
