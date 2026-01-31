"use client";

import { cn } from "@/lib/utils";

interface StockBadgeProps {
  quantity: number;
  inStock: boolean;
}

export function StockBadge({ quantity, inStock }: StockBadgeProps): React.ReactElement {
  if (!inStock || quantity === 0) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
        Out of Stock
      </span>
    );
  }

  if (quantity <= 5) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded bg-amber-100 text-amber-700">
        Low Stock ({quantity})
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-medium rounded bg-emerald-100 text-emerald-700">
      In Stock ({quantity})
    </span>
  );
}
