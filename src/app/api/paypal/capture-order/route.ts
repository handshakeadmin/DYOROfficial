import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { createClient } from "@/lib/supabase/server";

interface CaptureRequestBody {
  orderId: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cartItems: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  total: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CaptureRequestBody;
    const { orderId, customerInfo, shippingAddress, cartItems, subtotal, discount, discountCode, shipping, total } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const captureData = await capturePayPalOrder(orderId);

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderNumber = `PS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        guest_email: user ? null : customerInfo.email,
        status: "processing",
        subtotal,
        discount_amount: discount,
        discount_code: discountCode || null,
        shipping_cost: shipping,
        tax: 0,
        total,
        payment_method: "paypal",
        payment_status: "paid",
        paypal_order_id: orderId,
        paypal_capture_id: captureData.purchase_units[0]?.payments?.captures[0]?.id,
        shipping_first_name: customerInfo.firstName,
        shipping_last_name: customerInfo.lastName,
        shipping_email: customerInfo.email,
        shipping_phone: customerInfo.phone || null,
        shipping_address_line1: shippingAddress.addressLine1,
        shipping_address_line2: shippingAddress.addressLine2 || null,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_zip_code: shippingAddress.zipCode,
        shipping_country: shippingAddress.country,
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order record" },
        { status: 500 }
      );
    }

    const orderItems = cartItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
    }

    // Handle affiliate tracking if discount code was used
    if (discountCode) {
      const { data: discountCodeData } = await supabase
        .from("discount_codes")
        .select("id, is_affiliate, commission_percent, current_uses")
        .eq("code", discountCode.toUpperCase())
        .single();

      if (discountCodeData) {
        // Increment usage count for the discount code
        await supabase
          .from("discount_codes")
          .update({ current_uses: (discountCodeData.current_uses || 0) + 1 })
          .eq("id", discountCodeData.id);

        // Create affiliate order record if this is an affiliate code
        if (discountCodeData.is_affiliate && discountCodeData.commission_percent) {
          const commissionAmount = total * (discountCodeData.commission_percent / 100);

          await supabase.from("affiliate_orders").insert({
            order_id: newOrder.id,
            discount_code_id: discountCodeData.id,
            order_total: total,
            commission_rate: discountCodeData.commission_percent,
            commission_amount: commissionAmount,
            status: "pending",
          });
        }
      }
    }

    if (user) {
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (cart) {
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}
