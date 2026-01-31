import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export interface DashboardStats {
  revenue: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  orders: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  customers: {
    total: number;
    thisMonth: number;
    change: number;
  };
  averageOrderValue: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    slug: string;
    sku: string;
    stockQuantity: number;
  }>;
}

export async function GET(): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    thisMonthOrders,
    lastMonthOrders,
    totalCustomers,
    thisMonthCustomers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total")
      .gte("created_at", thisMonthStart.toISOString())
      .not("status", "eq", "cancelled"),

    supabase
      .from("orders")
      .select("id, total")
      .gte("created_at", lastMonthStart.toISOString())
      .lt("created_at", thisMonthStart.toISOString())
      .not("status", "eq", "cancelled"),

    supabase.from("users").select("id", { count: "exact", head: true }),

    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thisMonthStart.toISOString()),

    supabase
      .from("orders")
      .select(
        "id, order_number, total, status, created_at, shipping_first_name, shipping_last_name, shipping_email, guest_email"
      )
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("products")
      .select("id, name, slug, sku, stock_quantity")
      .or("stock_quantity.lte.5,in_stock.eq.false")
      .order("stock_quantity", { ascending: true })
      .limit(5),
  ]);

  const thisMonthData = thisMonthOrders.data || [];
  const lastMonthData = lastMonthOrders.data || [];

  const thisMonthRevenue = thisMonthData.reduce(
    (sum: number, o: { total: number | string }) => sum + (Number(o.total) || 0),
    0
  );
  const lastMonthRevenue = lastMonthData.reduce(
    (sum: number, o: { total: number | string }) => sum + (Number(o.total) || 0),
    0
  );

  const thisMonthOrderCount = thisMonthData.length;
  const lastMonthOrderCount = lastMonthData.length;

  const revenueChange =
    lastMonthRevenue > 0
      ? Math.round(
          ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        )
      : thisMonthRevenue > 0
      ? 100
      : 0;

  const ordersChange =
    lastMonthOrderCount > 0
      ? Math.round(
          ((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) *
            100
        )
      : thisMonthOrderCount > 0
      ? 100
      : 0;

  const totalCustomerCount = totalCustomers.count || 0;
  const thisMonthCustomerCount = thisMonthCustomers.count || 0;
  const lastMonthCustomerCount = Math.max(
    0,
    totalCustomerCount - thisMonthCustomerCount
  );
  const customerChange =
    lastMonthCustomerCount > 0
      ? Math.round(
          ((thisMonthCustomerCount - lastMonthCustomerCount) /
            lastMonthCustomerCount) *
            100
        )
      : thisMonthCustomerCount > 0
      ? 100
      : 0;

  const thisMonthAOV =
    thisMonthOrderCount > 0 ? thisMonthRevenue / thisMonthOrderCount : 0;
  const lastMonthAOV =
    lastMonthOrderCount > 0 ? lastMonthRevenue / lastMonthOrderCount : 0;
  const aovChange =
    lastMonthAOV > 0
      ? Math.round(((thisMonthAOV - lastMonthAOV) / lastMonthAOV) * 100)
      : thisMonthAOV > 0
      ? 100
      : 0;

  const stats: DashboardStats = {
    revenue: {
      thisMonth: thisMonthRevenue,
      lastMonth: lastMonthRevenue,
      change: revenueChange,
    },
    orders: {
      thisMonth: thisMonthOrderCount,
      lastMonth: lastMonthOrderCount,
      change: ordersChange,
    },
    customers: {
      total: totalCustomerCount,
      thisMonth: thisMonthCustomerCount,
      change: customerChange,
    },
    averageOrderValue: {
      thisMonth: thisMonthAOV,
      lastMonth: lastMonthAOV,
      change: aovChange,
    },
    recentOrders: (recentOrders.data || []).map((o: Record<string, unknown>) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName:
        o.shipping_first_name && o.shipping_last_name
          ? `${o.shipping_first_name} ${o.shipping_last_name}`
          : "",
      customerEmail: o.shipping_email || o.guest_email || "",
      total: Number(o.total) || 0,
      status: o.status,
      createdAt: o.created_at,
    })),
    lowStockProducts: (lowStockProducts.data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      stockQuantity: p.stock_quantity,
    })),
  };

  return NextResponse.json(stats);
}
