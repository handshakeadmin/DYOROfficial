import { z } from "zod";

export const affiliateCommissionStatusSchema = z.enum([
  "pending",
  "approved",
  "paid",
  "cancelled",
]);

export type AffiliateCommissionStatus = z.infer<typeof affiliateCommissionStatusSchema>;

export const affiliateCommissionUpdateSchema = z.object({
  status: affiliateCommissionStatusSchema,
  notes: z.string().optional().nullable(),
});

export type AffiliateCommissionUpdate = z.infer<typeof affiliateCommissionUpdateSchema>;

export const affiliateFilterSchema = z.object({
  search: z.string().optional(),
  status: affiliateCommissionStatusSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type AffiliateFilter = z.infer<typeof affiliateFilterSchema>;

export const affiliateStatsSchema = z.object({
  totalOrders: z.number().int(),
  totalRevenue: z.number(),
  totalCommission: z.number(),
  pendingCommission: z.number(),
  approvedCommission: z.number(),
  paidCommission: z.number(),
});

export type AffiliateStats = z.infer<typeof affiliateStatsSchema>;
