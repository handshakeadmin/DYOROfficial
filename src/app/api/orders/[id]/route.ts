import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const orderId = params.id;

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

    // Fetch the order
    const { data: order, error: orderError } = await supabase
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
        shipping_first_name,
        shipping_last_name,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_zip_code,
        shipping_country,
        created_at,
        updated_at,
        user_id,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Get product details
    const productIds = order.order_items.map((item: { product_id: string }) => item.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, images")
      .in("id", productIds);

    const productMap = new Map(
      products?.map((p: { id: string; name: string; slug: string; images: string[] }) => [p.id, p]) || []
    );

    // Format the response
    const formattedOrder = {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      subtotal: order.subtotal,
      shipping: order.shipping_cost,
      discount: order.discount_amount,
      total: order.total,
      created_at: order.created_at,
      updated_at: order.updated_at,
      tracking: order.tracking_number
        ? {
            carrier: order.carrier || "Carrier",
            tracking_number: order.tracking_number,
            tracking_url: `https://www.google.com/search?q=${order.tracking_number}`,
          }
        : null,
      shipping_address: {
        first_name: order.shipping_first_name,
        last_name: order.shipping_last_name,
        address_line1: order.shipping_address_line1,
        address_line2: order.shipping_address_line2,
        city: order.shipping_city,
        state: order.shipping_state,
        zip_code: order.shipping_zip_code,
        country: order.shipping_country || "US",
      },
      items: order.order_items.map((item: { id: string; product_id: string; quantity: number; price_at_purchase: number }) => {
        const product = productMap.get(item.product_id) as { name: string; slug: string; images: string[] } | undefined;
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
      status_history: [], // Could be populated from a status_history table if implemented
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the order" },
      { status: 500 }
    );
  }
}
