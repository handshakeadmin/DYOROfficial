"use client";

import { useState } from "react";
import { validateDiscountCode, formatDiscountDisplay, type DiscountCode } from "@/lib/discount-codes";

interface DiscountCodeInputProps {
  orderTotal: number;
  onApply: (discount: DiscountCode | null) => void;
  appliedDiscount: DiscountCode | null;
}

export function DiscountCodeInput({
  orderTotal,
  onApply,
  appliedDiscount,
}: DiscountCodeInputProps): React.JSX.Element {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async (): Promise<void> => {
    if (!code.trim()) {
      setError("Please enter a discount code");
      return;
    }

    setIsLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = validateDiscountCode(code, orderTotal);

    if (result.valid && result.discount) {
      onApply(result.discount);
      setCode("");
    } else {
      setError(result.error || "Invalid code");
    }

    setIsLoading(false);
  };

  const handleRemove = (): void => {
    onApply(null);
    setCode("");
    setError(null);
  };

  if (appliedDiscount) {
    return (
      <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <span className="font-medium text-success">{appliedDiscount.code}</span>
            <span className="text-sm text-muted ml-2">
              ({formatDiscountDisplay(appliedDiscount)})
            </span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="Enter discount code"
          className="flex-1 px-3 py-2 border border-border rounded focus:outline-none focus:border-primary text-sm"
        />
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          {isLoading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
