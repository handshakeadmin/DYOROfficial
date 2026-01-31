"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";
import type { DiscountCode } from "@/lib/discount-codes";

interface MobileOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: DiscountCode | null;
  discountAmount: number;
  shipping: number;
  total: number;
}

export function MobileOrderSummary({
  items,
  subtotal,
  discount,
  discountAmount,
  shipping,
  total,
}: MobileOrderSummaryProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="lg:hidden border-b border-border bg-card">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </div>
        <span className="font-semibold">{formatPrice(total)}</span>
      </button>

      {/* Expandable Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 space-y-4">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={item.product.images[0] || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-muted">{item.product.dosage}</p>
                </div>
                <p className="text-sm font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discount ({discount?.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              {shipping === 0 ? (
                <span className="text-success">Free</span>
              ) : (
                <span>{formatPrice(shipping)}</span>
              )}
            </div>

            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
