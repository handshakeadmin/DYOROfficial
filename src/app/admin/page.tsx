"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { KPICard, RecentOrders, LowStockAlert } from "@/components/admin/dashboard";
import { formatPrice } from "@/lib/utils";
import type { DashboardStats } from "@/app/api/admin/stats/route";

export default function AdminDashboardPage(): React.ReactElement {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Store overview and metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenue This Month"
          value={stats ? formatPrice(stats.revenue.thisMonth) : "$0.00"}
          change={
            stats
              ? {
                  value: stats.revenue.change,
                  isPositive: stats.revenue.change >= 0,
                }
              : undefined
          }
          icon={DollarSign}
          iconColor="bg-emerald-100 text-emerald-600"
          loading={loading}
        />
        <KPICard
          title="Orders This Month"
          value={stats?.orders.thisMonth ?? 0}
          change={
            stats
              ? {
                  value: stats.orders.change,
                  isPositive: stats.orders.change >= 0,
                }
              : undefined
          }
          icon={ShoppingCart}
          iconColor="bg-blue-100 text-blue-600"
          loading={loading}
        />
        <KPICard
          title="Total Customers"
          value={stats?.customers.total ?? 0}
          change={
            stats
              ? {
                  value: stats.customers.change,
                  isPositive: stats.customers.change >= 0,
                }
              : undefined
          }
          icon={Users}
          iconColor="bg-purple-100 text-purple-600"
          loading={loading}
        />
        <KPICard
          title="Avg. Order Value"
          value={stats ? formatPrice(stats.averageOrderValue.thisMonth) : "$0.00"}
          change={
            stats
              ? {
                  value: stats.averageOrderValue.change,
                  isPositive: stats.averageOrderValue.change >= 0,
                }
              : undefined
          }
          icon={TrendingUp}
          iconColor="bg-amber-100 text-amber-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentOrders
          orders={stats?.recentOrders ?? []}
          loading={loading}
        />
        <LowStockAlert
          products={stats?.lowStockProducts ?? []}
          loading={loading}
        />
      </div>
    </div>
  );
}
