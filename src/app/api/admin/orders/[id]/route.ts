import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { orderStatusUpdateSchema } from "@/lib/validations/order";

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

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      user_id,
      subtotal,
      discount_amount,
      discount_code,
      shipping_cost,
      tax,
      total,
      status,
      payment_status,
      payment_method,
      paypal_order_id,
      paypal_capture_id,
      tracking_number,
      carrier,
      shipped_at,
      notes,
      created_at,
      updated_at,
      shipping_first_name,
      shipping_last_name,
      shipping_email,
      shipping_phone,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_zip_code,
      shipping_country,
      guest_email
    `
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_id, product_name, quantity, price_at_purchase")
    .eq("order_id", id);

  const formattedOrder = {
    id: order.id,
    orderNumber: order.order_number,
    userId: order.user_id,
    customerName:
      order.shipping_first_name && order.shipping_last_name
        ? `${order.shipping_first_name} ${order.shipping_last_name}`
        : "",
    customerEmail: order.shipping_email || order.guest_email || "",
    subtotal: Number(order.subtotal) || 0,
    discountAmount: Number(order.discount_amount) || 0,
    discountCode: order.discount_code,
    shippingCost: Number(order.shipping_cost) || 0,
    tax: Number(order.tax) || 0,
    total: Number(order.total) || 0,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    paypalOrderId: order.paypal_order_id,
    paypalCaptureId: order.paypal_capture_id,
    trackingNumber: order.tracking_number,
    carrier: order.carrier,
    shippedAt: order.shipped_at,
    notes: order.notes,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    shippingAddress: {
      firstName: order.shipping_first_name || "",
      lastName: order.shipping_last_name || "",
      email: order.shipping_email || order.guest_email || "",
      phone: order.shipping_phone,
      addressLine1: order.shipping_address_line1 || "",
      addressLine2: order.shipping_address_line2,
      city: order.shipping_city || "",
      state: order.shipping_state || "",
      zipCode: order.shipping_zip_code || "",
      country: order.shipping_country || "US",
    },
    items: (items || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      priceAtPurchase: Number(item.price_at_purchase) || 0,
    })),
  };

  return NextResponse.json(formattedOrder);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const validationResult = orderStatusUpdateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validationResult.error.issues },
      { status: 400 }
    );
  }

  const { status, trackingNumber, carrier, notes } = validationResult.data;
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {
    status,
  };

  if (trackingNumber !== undefined) {
    updateData.tracking_number = trackingNumber;
  }

  if (carrier !== undefined) {
    updateData.carrier = carrier;
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  if (status === "shipped" && !updateData.shipped_at) {
    updateData.shipped_at = new Date().toISOString();
  }

  const { data: updatedOrder, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !updatedOrder) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    order: {
      id: updatedOrder.id,
      status: updatedOrder.status,
      trackingNumber: updatedOrder.tracking_number,
      carrier: updatedOrder.carrier,
      shippedAt: updatedOrder.shipped_at,
    },
  });
}
