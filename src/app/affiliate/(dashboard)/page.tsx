"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  Copy,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface AffiliateStats {
  affiliateName: string;
  code: string;
  discountPercent: number;
  commissionPercent: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    orderTotal: number;
    commissionAmount: number;
    status: string;
    createdAt: string;
  }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AffiliateDashboardPage(): React.ReactElement {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const response = await fetch("/api/affiliate/stats");
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

  const copyReferralLink = async (): Promise<void> => {
    if (!stats) return;

    const link = `${window.location.origin}?ref=${stats.code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || "Failed to load dashboard"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {stats.affiliateName}
        </h1>
        <p className="text-gray-500 mt-1">
          Track your referral performance and commissions
        </p>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Your Referral Link</h2>
            <p className="text-emerald-100 text-sm">
              Share this link to earn {stats.commissionPercent}% commission on
              every sale. Customers get {stats.discountPercent}% off!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-mono text-sm">
                {typeof window !== "undefined"
                  ? `${window.location.origin}?ref=${stats.code}`
                  : `https://dyorwellness.com?ref=${stats.code}`}
              </span>
            </div>
            <button
              onClick={copyReferralLink}
              className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-emerald-100 text-sm">
            Your code: <span className="font-mono font-semibold">{stats.code}</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Earned
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatPrice(stats.totalCommission)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.commissionPercent}% commission rate
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Payout
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {formatPrice(stats.pendingCommission + stats.approvedCommission)}
              </p>
              {stats.pendingCommission > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatPrice(stats.pendingCommission)} awaiting approval
                </p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Pending Approval
          </h3>
          <p className="text-xl font-bold text-yellow-600">
            {formatPrice(stats.pendingCommission)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Commissions from recent orders
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Ready for Payout
          </h3>
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(stats.approvedCommission)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Approved and ready to be paid
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Paid</h3>
          <p className="text-xl font-bold text-emerald-600">
            {formatPrice(stats.paidCommission)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Successfully paid out
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <a
            href="/affiliate/orders"
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
          >
            View all
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Share your referral link to start earning commissions
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Your Commission
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatPrice(order.orderTotal)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-emerald-600">
                        {formatPrice(order.commissionAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full capitalize",
                          statusColors[order.status] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
