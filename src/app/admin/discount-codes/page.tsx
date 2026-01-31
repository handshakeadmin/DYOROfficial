"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { DiscountCodesTable } from "@/components/admin/discounts";
import { Plus, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

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

interface DiscountCodesResponse {
  codes: DiscountCode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminDiscountCodesPage(): React.ReactElement {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isAffiliate, setIsAffiliate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchCodes = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);
      if (isActive) params.set("isActive", isActive);
      if (isAffiliate) params.set("isAffiliate", isAffiliate);

      const response = await fetch(`/api/admin/discount-codes?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch discount codes");
      }

      const data: DiscountCodesResponse = await response.json();
      setCodes(data.codes);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discount codes");
    } finally {
      setLoading(false);
    }
  }, [page, search, isActive, isAffiliate]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCodes();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchCodes]);

  const handleClearFilters = (): void => {
    setSearch("");
    setIsActive("");
    setIsAffiliate("");
    setPage(1);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/discount-codes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete discount code");
      }

      setCodes((prev) => prev.filter((c) => c.id !== id));
      setTotal((prev) => prev - 1);
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete discount code");
    }
  };

  const hasFilters = search || isActive || isAffiliate;

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchCodes}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-500 mt-1">
            Manage discount codes and affiliate programs.
          </p>
        </div>
        <Link
          href="/admin/discount-codes/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Code
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search codes..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <select
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            value={isAffiliate}
            onChange={(e) => {
              setIsAffiliate(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="true">Affiliate Only</option>
            <option value="false">Regular Only</option>
          </select>

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}

          <div className="text-sm text-gray-500">
            {total} {total === 1 ? "code" : "codes"}
          </div>
        </div>
      </div>

      <DiscountCodesTable
        codes={codes}
        loading={loading}
        onDelete={(id) => setDeleteConfirm(id)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Discount Code
            </h3>
            <p className="text-gray-500 mt-2">
              Are you sure you want to delete this discount code? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
