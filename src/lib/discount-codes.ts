export interface DiscountCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  isAffiliate: boolean;
  affiliateName?: string;
  affiliateEmail?: string;
  commission?: number;
  isActive: boolean;
  minOrderAmount?: number;
  maxUses?: number;
  currentUses?: number;
  expiresAt?: string;
}

// Static fallback codes
export const discountCodes: DiscountCode[] = [
  {
    code: "CRITTY",
    discount: 10,
    type: "percentage",
    isAffiliate: false,
    isActive: true,
  },
  {
    code: "MIKYLA",
    discount: 10,
    type: "percentage",
    isAffiliate: true,
    affiliateName: "Mikyla",
    commission: 10,
    isActive: true,
  },
  {
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    isAffiliate: false,
    isActive: true,
  },
  {
    code: "ALICIA",
    discount: 10,
    type: "percentage",
    isAffiliate: true,
    affiliateName: "Alicia",
    commission: 10,
    isActive: true,
  },
];

export interface DiscountValidationResult {
  valid: boolean;
  discount?: DiscountCode;
  error?: string;
}

// Database discount code interface
interface DbDiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  discount_type: "percentage" | "fixed";
  is_affiliate: boolean;
  affiliate_name: string | null;
  affiliate_email: string | null;
  commission_percent: number | null;
  min_order_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
}

function mapDbToDiscountCode(db: DbDiscountCode): DiscountCode {
  return {
    code: db.code,
    discount: db.discount_percent,
    type: db.discount_type,
    isAffiliate: db.is_affiliate,
    affiliateName: db.affiliate_name ?? undefined,
    affiliateEmail: db.affiliate_email ?? undefined,
    commission: db.commission_percent ?? undefined,
    isActive: db.is_active,
    minOrderAmount: db.min_order_amount ?? undefined,
    maxUses: db.max_uses ?? undefined,
    currentUses: db.current_uses,
    expiresAt: db.expires_at ?? undefined,
  };
}

// Async version that reads from database
export async function validateDiscountCodeAsync(
  code: string,
  orderTotal: number
): Promise<DiscountValidationResult> {
  const normalizedCode = code.toUpperCase().trim();

  try {
    // Try to read from database
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: dbCode, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .single();

      if (!error && dbCode) {
        const discount = mapDbToDiscountCode(dbCode as DbDiscountCode);

        if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
          return { valid: false, error: "This discount code has expired" };
        }

        if (discount.maxUses && discount.currentUses && discount.currentUses >= discount.maxUses) {
          return { valid: false, error: "This discount code has reached its usage limit" };
        }

        if (discount.minOrderAmount && orderTotal < discount.minOrderAmount) {
          return {
            valid: false,
            error: `Minimum order of $${discount.minOrderAmount.toFixed(2)} required`,
          };
        }

        return { valid: true, discount };
      }
    }
  } catch {
    // Fall through to static validation
  }

  // Fallback to static codes
  return validateDiscountCode(code, orderTotal);
}

// Synchronous version using static data (for backwards compatibility)
export function validateDiscountCode(
  code: string,
  orderTotal: number
): DiscountValidationResult {
  const normalizedCode = code.toUpperCase().trim();
  const discount = discountCodes.find(
    (d) => d.code.toUpperCase() === normalizedCode && d.isActive
  );

  if (!discount) {
    return { valid: false, error: "Invalid discount code" };
  }

  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { valid: false, error: "This discount code has expired" };
  }

  if (discount.maxUses && discount.currentUses && discount.currentUses >= discount.maxUses) {
    return { valid: false, error: "This discount code has reached its usage limit" };
  }

  if (discount.minOrderAmount && orderTotal < discount.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order of $${discount.minOrderAmount.toFixed(2)} required`,
    };
  }

  return { valid: true, discount };
}

export function calculateDiscount(discount: DiscountCode, orderTotal: number): number {
  if (discount.type === "percentage") {
    return orderTotal * (discount.discount / 100);
  }
  return Math.min(discount.discount, orderTotal);
}

export function formatDiscountDisplay(discount: DiscountCode): string {
  if (discount.type === "percentage") {
    return `${discount.discount}% off`;
  }
  return `$${discount.discount.toFixed(2)} off`;
}
