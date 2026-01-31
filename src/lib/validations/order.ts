import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export type OrderStatusType = z.infer<typeof orderStatusSchema>;

export const orderStatusUpdateSchema = z.object({
  status: orderStatusSchema,
  trackingNumber: z.string().optional().nullable(),
  carrier: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;

export const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: orderStatusSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type OrderFilter = z.infer<typeof orderFilterSchema>;
