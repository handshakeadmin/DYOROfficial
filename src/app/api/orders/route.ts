import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product_id: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string;
  order_items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Fetch orders for the user
    const { data: orders, error: ordersError, count } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        subtotal,
        shipping_cost,
        discount_amount,
        total,
        tracking_number,
        carrier,
        created_at,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id
        )
      `, { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    const typedOrders = orders as Order[] | null;

    // Get all unique product IDs
    const productIds = new Set<string>();
    typedOrders?.forEach((order: Order) => {
      order.order_items.forEach((item: OrderItem) => {
        productIds.add(item.product_id);
      });
    });

    // Fetch product details
    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, images")
      .in("id", Array.from(productIds));

    const typedProducts = products as Product[] | null;
    const productMap = new Map<string, Product>(
      typedProducts?.map((p: Product) => [p.id, p]) || []
    );

    // Format orders with product details
    const formattedOrders = typedOrders?.map((order: Order) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      subtotal: order.subtotal,
      shipping: order.shipping_cost,
      discount: order.discount_amount,
      total: order.total,
      created_at: order.created_at,
      tracking: order.tracking_number
        ? {
            carrier: order.carrier || "Carrier",
            tracking_number: order.tracking_number,
            tracking_url: `https://www.google.com/search?q=${order.tracking_number}`,
          }
        : null,
      items: order.order_items.map((item: OrderItem) => {
        const product = productMap.get(item.product_id);
        return {
          id: item.id,
          product_id: item.product_id,
          product_name: product?.name || "Product",
          product_slug: product?.slug || "",
          product_image: product?.images?.[0] || null,
          quantity: item.quantity,
          price: item.price_at_purchase,
        };
      }),
      item_count: order.order_items.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0),
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in orders API:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching orders" },
      { status: 500 }
    );
  }
}
