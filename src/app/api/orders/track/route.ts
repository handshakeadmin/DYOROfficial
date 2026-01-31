import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface TrackOrderRequest {
  orderNumber: string;
  email: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as TrackOrderRequest;
    const { orderNumber, email } = body;

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Look up the order by order number and guest email or user email
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
        guest_email,
        user_id,
        created_at,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id
        )
      `)
      .eq("order_number", orderNumber.toUpperCase())
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found. Please check your order number and try again." },
        { status: 404 }
      );
    }

    // Verify email matches either guest_email or user's email
    let emailMatch = false;

    if (order.guest_email) {
      emailMatch = order.guest_email.toLowerCase() === email.toLowerCase();
    }

    if (!emailMatch && order.user_id) {
      // Check if email matches the user's email
      const { data: user } = await supabase
        .from("users")
        .select("email")
        .eq("id", order.user_id)
        .single();

      if (user?.email?.toLowerCase() === email.toLowerCase()) {
        emailMatch = true;
      }
    }

    if (!emailMatch) {
      return NextResponse.json(
        { error: "Email does not match our records for this order." },
        { status: 404 }
      );
    }

    // Get product details for order items
    const productIds = order.order_items.map((item: { product_id: string }) => item.product_id);
    const { data: products } = await supabase
      .from("products")
      .select("id, name, images")
      .in("id", productIds);

    const productMap = new Map(products?.map((p: { id: string; name: string; images: string[] }) => [p.id, p]) || []);

    // Format the response (limited info for privacy)
    const formattedOrder = {
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
      items: order.order_items.map((item: { id: string; product_id: string; quantity: number; price_at_purchase: number }) => {
        const product = productMap.get(item.product_id) as { name: string; images: string[] } | undefined;
        return {
          id: item.id,
          product_name: product?.name || "Product",
          product_image: product?.images?.[0] || null,
          quantity: item.quantity,
          price: item.price_at_purchase,
        };
      }),
      subtotal: order.subtotal,
      shipping: order.shipping_cost,
      discount: order.discount_amount,
      total: order.total,
      tracking: order.tracking_number
        ? {
            carrier: order.carrier || "Carrier",
            tracking_number: order.tracking_number,
            tracking_url: `https://www.google.com/search?q=${order.tracking_number}`,
          }
        : undefined,
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "An error occurred while looking up your order" },
      { status: 500 }
    );
  }
}
