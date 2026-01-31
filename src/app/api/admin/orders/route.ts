import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  discountAmount: number;
  discountCode: string | null;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      subtotal,
      discount_amount,
      discount_code,
      shipping_cost,
      tax,
      total,
      status,
      payment_status,
      payment_method,
      tracking_number,
      carrier,
      shipped_at,
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
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,shipping_email.ilike.%${search}%,guest_email.ilike.%${search}%,shipping_first_name.ilike.%${search}%,shipping_last_name.ilike.%${search}%`
    );
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo);
  }

  query = query.range(offset, offset + limit - 1);

  const { data: orders, error, count } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }

  const formattedOrders: AdminOrder[] = (orders || []).map((o: Record<string, unknown>) => ({
    id: o.id as string,
    orderNumber: o.order_number as string,
    customerName:
      o.shipping_first_name && o.shipping_last_name
        ? `${o.shipping_first_name} ${o.shipping_last_name}`
        : "",
    customerEmail: (o.shipping_email || o.guest_email || "") as string,
    subtotal: Number(o.subtotal) || 0,
    discountAmount: Number(o.discount_amount) || 0,
    discountCode: o.discount_code as string | null,
    shippingCost: Number(o.shipping_cost) || 0,
    tax: Number(o.tax) || 0,
    total: Number(o.total) || 0,
    status: o.status as string,
    paymentStatus: o.payment_status as string,
    paymentMethod: o.payment_method as string | null,
    trackingNumber: o.tracking_number as string | null,
    carrier: o.carrier as string | null,
    shippedAt: o.shipped_at as string | null,
    createdAt: o.created_at as string,
    updatedAt: o.updated_at as string,
    shippingAddress: {
      firstName: (o.shipping_first_name || "") as string,
      lastName: (o.shipping_last_name || "") as string,
      email: (o.shipping_email || o.guest_email || "") as string,
      phone: o.shipping_phone as string | null,
      addressLine1: (o.shipping_address_line1 || "") as string,
      addressLine2: o.shipping_address_line2 as string | null,
      city: (o.shipping_city || "") as string,
      state: (o.shipping_state || "") as string,
      zipCode: (o.shipping_zip_code || "") as string,
      country: (o.shipping_country || "US") as string,
    },
    items: [],
  }));

  return NextResponse.json({
    orders: formattedOrders,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
