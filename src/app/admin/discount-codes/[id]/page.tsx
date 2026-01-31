"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountCodeDetail {
  id: string;
  code: string;
  discountPercent: number;
  discountType: string;
  isAffiliate: boolean;
  affiliateName: string | null;
  affiliateEmail: string | null;
  commissionPercent: number | null;
  minOrderAmount: number;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
}

export default function EditDiscountCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): React.ReactElement {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DiscountCodeDetail>>({
    code: "",
    discountPercent: 10,
    discountType: "percentage",
    isAffiliate: false,
    affiliateName: "",
    affiliateEmail: "",
    commissionPercent: 10,
    minOrderAmount: 0,
    maxUses: null,
    isActive: true,
    expiresAt: null,
  });

  useEffect(() => {
    if (isNew) return;

    const fetchCode = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/admin/discount-codes/${id}`);
        if (!response.ok) {
          throw new Error("Discount code not found");
        }
        const data = await response.json();
        setFormData({
          ...data,
          expiresAt: data.expiresAt ? data.expiresAt.split("T")[0] : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load discount code");
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        code: (formData.code || "").toUpperCase(),
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : null,
      };

      const url = isNew
        ? "/api/admin/discount-codes"
        : `/api/admin/discount-codes/${id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save discount code");
      }

      router.push("/admin/discount-codes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save discount code");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Are you sure you want to delete this discount code?")) return;

    try {
      const response = await fetch(`/api/admin/discount-codes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete discount code");
      }

      router.push("/admin/discount-codes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete discount code");
    }
  };

  const updateField = <K extends keyof DiscountCodeDetail>(
    field: K,
    value: DiscountCodeDetail[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/discount-codes"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Create Discount Code" : "Edit Discount Code"}
          </h1>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Code Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                value={formData.code || ""}
                onChange={(e) => updateField("code", e.target.value.toUpperCase())}
                required
                pattern="[A-Z0-9]+"
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                placeholder="DISCOUNT10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Uppercase letters and numbers only
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <select
                value={formData.discountType || "percentage"}
                onChange={(e) => updateField("discountType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.discountType === "percentage" ? 100 : undefined}
                  value={formData.discountPercent || 0}
                  onChange={(e) =>
                    updateField("discountPercent", parseFloat(e.target.value) || 0)
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {formData.discountType === "percentage" ? "%" : "$"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minOrderAmount || 0}
                  onChange={(e) =>
                    updateField("minOrderAmount", parseFloat(e.target.value) || 0)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Usage Limits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Uses (leave empty for unlimited)
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxUses || ""}
                onChange={(e) =>
                  updateField(
                    "maxUses",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date (optional)
              </label>
              <input
                type="date"
                value={formData.expiresAt || ""}
                onChange={(e) =>
                  updateField("expiresAt", e.target.value || null)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {!isNew && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Uses
                </label>
                <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {formData.currentUses || 0}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Affiliate Settings
            </h2>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAffiliate || false}
                onChange={(e) => updateField("isAffiliate", e.target.checked)}
                className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">
                This is an affiliate code
              </span>
            </label>
          </div>

          {formData.isAffiliate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliate Name *
                </label>
                <input
                  type="text"
                  value={formData.affiliateName || ""}
                  onChange={(e) => updateField("affiliateName", e.target.value)}
                  required={formData.isAffiliate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliate Email
                </label>
                <input
                  type="email"
                  value={formData.affiliateEmail || ""}
                  onChange={(e) => updateField("affiliateEmail", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission % *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.commissionPercent || 0}
                  onChange={(e) =>
                    updateField(
                      "commissionPercent",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  required={formData.isAffiliate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive || false}
              onChange={(e) => updateField("isActive", e.target.checked)}
              className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">
              Code is active and can be used at checkout
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/discount-codes"
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Code
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
