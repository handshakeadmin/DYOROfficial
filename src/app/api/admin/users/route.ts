import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const offset = (page - 1) * limit;

  try {
    // Build the query
    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    // Search filter
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    // Date filters
    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    // Execute with pagination
    const { data: users, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Get order stats for each user
    const usersWithStats = await Promise.all(
      (users || []).map(async (user: Record<string, unknown>) => {
        const { data: orderStats } = await supabase
          .from("orders")
          .select("total")
          .eq("user_id", user.id);

        const totalOrders = orderStats?.length || 0;
        const totalSpent = orderStats?.reduce((sum: number, order: { total: number | null }) => sum + (order.total || 0), 0) || 0;

        return {
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
        };
      })
    );

    return NextResponse.json({
      users: usersWithStats,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
