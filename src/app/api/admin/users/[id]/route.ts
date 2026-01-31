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
  const supabase = await createClient();

  // Get user details
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get user's addresses
  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", id)
    .order("is_default", { ascending: false });

  // Get order stats
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total")
    .eq("user_id", id);

  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum: number, order: Record<string, unknown>) => sum + (Number(order.total) || 0), 0) || 0;

  return NextResponse.json({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    isAdmin: user.is_admin,
    totalOrders,
    totalSpent,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    addresses: (addresses || []).map((addr: Record<string, unknown>) => ({
      id: addr.id,
      firstName: addr.first_name,
      lastName: addr.last_name,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code,
      country: addr.country,
      isDefault: addr.is_default,
    })),
  });
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
  const supabase = await createClient();

  // Get current user to prevent self-demotion
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (currentUser?.id === id) {
    return NextResponse.json(
      { error: "Cannot modify your own admin status" },
      { status: 403 }
    );
  }

  // Check if target user exists
  const { data: targetUser, error: userError } = await supabase
    .from("users")
    .select("id, email, is_admin")
    .eq("id", id)
    .single();

  if (userError || !targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const { isAdmin: newAdminStatus } = body;

  if (typeof newAdminStatus !== "boolean") {
    return NextResponse.json(
      { error: "isAdmin must be a boolean" },
      { status: 400 }
    );
  }

  // Update admin status
  const { error: updateError } = await supabase
    .from("users")
    .update({ is_admin: newAdminStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) {
    console.error("Error updating user admin status:", updateError);
    return NextResponse.json(
      { error: "Failed to update admin status" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: newAdminStatus ? "User promoted to admin" : "Admin privileges revoked",
    isAdmin: newAdminStatus,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  // Check if user exists and is not an admin
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, is_admin")
    .eq("id", id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.is_admin) {
    return NextResponse.json(
      { error: "Cannot delete admin users" },
      { status: 403 }
    );
  }

  // Delete user from users table (cascades to addresses, carts, wishlists)
  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "User deleted successfully",
  });
}
