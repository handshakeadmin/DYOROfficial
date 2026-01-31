import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { affiliateCommissionUpdateSchema } from "@/lib/validations/affiliate";

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

  const validationResult = affiliateCommissionUpdateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validationResult.error.issues },
      { status: 400 }
    );
  }

  const { status } = validationResult.data;
  const supabase = await createClient();

  const updateData: Record<string, unknown> = { status };

  if (status === "approved") {
    updateData.approved_at = new Date().toISOString();
  } else if (status === "paid") {
    updateData.paid_at = new Date().toISOString();
  }

  const { data: updatedOrder, error } = await supabase
    .from("affiliate_orders")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !updatedOrder) {
    console.error("Error updating affiliate order:", error);
    return NextResponse.json(
      { error: "Failed to update affiliate order" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    order: {
      id: updatedOrder.id,
      status: updatedOrder.status,
      approvedAt: updatedOrder.approved_at,
      paidAt: updatedOrder.paid_at,
    },
  });
}
