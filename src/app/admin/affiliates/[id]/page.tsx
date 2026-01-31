"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { CommissionApproval } from "@/components/admin/affiliates";

interface AffiliateOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  orderTotal: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  approvedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface AffiliateDetail {
  id: string;
  code: string;
  affiliateName: string;
  affiliateEmail: string | null;
  discountPercent: number;
  commissionPercent: number;
  isActive: boolean;
  createdAt: string;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  orders: AffiliateOrder[];
}

export default function AffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.ReactElement {
  const { id } = use(params);
  const [affiliate, setAffiliate] = useState<AffiliateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliate = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/affiliates/${id}`);
      if (!response.ok) {
        throw new Error("Affiliate not found");
      }
      const data = await response.json();
      setAffiliate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load affiliate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliate();
  }, [id]);

  const handleStatusUpdate = async (
    orderId: string,
    status: string
  ): Promise<void> => {
    const response = await fetch(`/api/admin/affiliate-orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update status");
    }

    // Refresh affiliate data
    await fetchAffiliate();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !affiliate) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || "Affiliate not found"}</p>
        <Link
          href="/admin/affiliates"
          className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Back to Affiliates
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/affiliates"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {affiliate.affiliateName}
            </h1>
            <span
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-full",
                affiliate.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              {affiliate.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="font-mono">{affiliate.code}</span>
            {affiliate.affiliateEmail && (
              <>
                <span>•</span>
                <span>{affiliate.affiliateEmail}</span>
              </>
            )}
          </div>
        </div>
        <Link
          href={`/admin/discount-codes/${affiliate.id}`}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Edit Code
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {affiliate.totalOrders}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatPrice(affiliate.totalRevenue)}
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
                Total Commission
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatPrice(affiliate.totalCommission)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {affiliate.commissionPercent}% rate
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
                {formatPrice(affiliate.pendingCommission + affiliate.approvedCommission)}
              </p>
              {affiliate.pendingCommission > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatPrice(affiliate.pendingCommission)} awaiting approval
                </p>
              )}
            </div>
            <div className="p-3 rounded-xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Pending Approval
          </h3>
          <p className="text-xl font-bold text-yellow-600">
            {formatPrice(affiliate.pendingCommission)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Approved (Unpaid)
          </h3>
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(affiliate.approvedCommission)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Paid</h3>
          <p className="text-xl font-bold text-emerald-600">
            {formatPrice(affiliate.paidCommission)}
          </p>
        </div>
      </div>

      <CommissionApproval
        orders={affiliate.orders}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
