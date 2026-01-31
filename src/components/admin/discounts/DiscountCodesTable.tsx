"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Users, Percent, DollarSign } from "lucide-react";

interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  discountType: string;
  isAffiliate: boolean;
  affiliateName: string | null;
  commissionPercent: number | null;
  currentUses: number;
  maxUses: number | null;
  isActive: boolean;
  expiresAt: string | null;
}

interface DiscountCodesTableProps {
  codes: DiscountCode[];
  loading?: boolean;
  onDelete?: (id: string) => void;
}

export function DiscountCodesTable({
  codes,
  loading = false,
  onDelete,
}: DiscountCodesTableProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uses
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
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 w-16 bg-gray-200 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (codes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500">No discount codes found.</p>
        <Link
          href="/admin/discount-codes/new"
          className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Create Discount Code
        </Link>
      </div>
    );
  }

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uses
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {codes.map((code) => (
              <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <span className="font-mono font-medium text-gray-900">
                      {code.code}
                    </span>
                    {code.isAffiliate && code.affiliateName && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3" />
                        {code.affiliateName}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {code.discountType === "percentage" ? (
                      <>
                        <Percent className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {code.discountPercent}%
                        </span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          ${code.discountPercent}
                        </span>
                      </>
                    )}
                    {code.isAffiliate && code.commissionPercent && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({code.commissionPercent}% commission)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      code.isAffiliate
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {code.isAffiliate ? "Affiliate" : "Regular"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {code.currentUses}
                  {code.maxUses && ` / ${code.maxUses}`}
                </td>
                <td className="px-6 py-4">
                  {!code.isActive ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      Inactive
                    </span>
                  ) : isExpired(code.expiresAt) ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                      Expired
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/discount-codes/${code.id}`}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(code.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
