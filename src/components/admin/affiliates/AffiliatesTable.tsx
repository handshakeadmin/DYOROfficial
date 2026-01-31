"use client";

import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { Eye, Users } from "lucide-react";

interface Affiliate {
  id: string;
  code: string;
  affiliateName: string;
  affiliateEmail: string | null;
  commissionPercent: number;
  isActive: boolean;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  pendingCommission: number;
}

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  loading?: boolean;
}

export function AffiliatesTable({
  affiliates,
  loading = false,
}: AffiliatesTableProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (affiliates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No affiliates found.</p>
        <p className="text-sm text-gray-400 mt-1">
          Create affiliate discount codes to track referral sales.
        </p>
        <Link
          href="/admin/discount-codes/new"
          className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Create Affiliate Code
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affiliate
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commission
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {affiliates.map((affiliate) => (
              <tr
                key={affiliate.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {affiliate.affiliateName}
                    </p>
                    {affiliate.affiliateEmail && (
                      <p className="text-sm text-gray-500">
                        {affiliate.affiliateEmail}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-900">
                    {affiliate.code}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({affiliate.commissionPercent}%)
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {affiliate.totalOrders}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatPrice(affiliate.totalRevenue)}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(affiliate.totalCommission)}
                    </span>
                    {affiliate.pendingCommission > 0 && (
                      <span className="block text-xs text-amber-600">
                        {formatPrice(affiliate.pendingCommission)} pending
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      affiliate.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {affiliate.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/affiliates/${affiliate.id}`}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
