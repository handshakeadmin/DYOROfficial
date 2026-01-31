"use client";

import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  stockQuantity: number;
}

interface LowStockAlertProps {
  products: LowStockProduct[];
  loading?: boolean;
}

export function LowStockAlert({
  products,
  loading = false,
}: LowStockAlertProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Low Stock Alerts
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-2.5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-14 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Low Stock Alerts
          </h2>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          All products are well stocked.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Low Stock Alerts
        </h2>
        <Link
          href="/admin/products?filter=low-stock"
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          View all
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/admin/products/${product.id}`}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sku}</p>
            </div>
            <div
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                product.stockQuantity === 0
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              )}
            >
              {product.stockQuantity === 0
                ? "Out of Stock"
                : `${product.stockQuantity} left`}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
