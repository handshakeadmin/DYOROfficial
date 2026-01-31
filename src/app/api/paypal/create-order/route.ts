import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder, type CreateOrderPayload } from "@/lib/paypal";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateOrderPayload;

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const order = await createPayPalOrder(body);

    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
