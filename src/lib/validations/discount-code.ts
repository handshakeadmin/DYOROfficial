import { z } from "zod";

// Base schema without refinements (used for partial updates)
const discountCodeBaseSchema = z.object({
  code: z.string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must be at most 20 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase alphanumeric")
    .transform(val => val.toUpperCase()),
  discountPercent: z.number().min(0).max(100),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  isAffiliate: z.boolean().default(false),
  affiliateName: z.string().optional().nullable(),
  affiliateEmail: z.string().email().optional().nullable(),
  commissionPercent: z.number().min(0).max(100).optional().nullable(),
  minOrderAmount: z.number().min(0).default(0),
  maxUses: z.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().nullable(),
});

// Full schema with refinement for creating new codes
export const discountCodeSchema = discountCodeBaseSchema.refine(
  (data) => {
    if (data.isAffiliate) {
      return data.affiliateName && data.commissionPercent !== undefined && data.commissionPercent !== null;
    }
    return true;
  },
  {
    message: "Affiliate name and commission are required for affiliate codes",
    path: ["affiliateName"],
  }
);

export type DiscountCodeFormData = z.infer<typeof discountCodeSchema>;

// Update schema uses the base schema (without refine) so .partial() works
export const discountCodeUpdateSchema = discountCodeBaseSchema.partial().extend({
  id: z.string().uuid(),
});

export type DiscountCodeUpdateData = z.infer<typeof discountCodeUpdateSchema>;

export const discountCodeFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isAffiliate: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type DiscountCodeFilter = z.infer<typeof discountCodeFilterSchema>;
