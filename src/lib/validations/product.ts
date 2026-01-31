import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  fullName: z.string().max(200).optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes"),
  sku: z.string().min(1, "SKU is required").max(50),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  longDescription: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0).optional().nullable(),
  productType: z.enum(["lyophilized", "capsules", "nasal-spray", "serum", "injectable", "blend"]),
  categoryName: z.string().min(1, "Category is required"),
  categoryId: z.string().uuid().optional().nullable(),
  dosage: z.string().min(1, "Dosage is required"),
  form: z.string().min(1, "Form is required"),
  purity: z.string().default("99%+"),
  molecularWeight: z.string().optional(),
  sequence: z.string().optional(),
  storageInstructions: z.string().min(1, "Storage instructions are required"),
  specifications: z.string().optional(),
  researchApplications: z.array(z.string()).min(1, "At least one research application is required"),
  benefits: z.array(z.string()).optional(),
  mechanismOfAction: z.string().optional(),
  researchReferences: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    source: z.string(),
  })).optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  onSale: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const productStockUpdateSchema = z.object({
  stockQuantity: z.number().int().min(0),
  inStock: z.boolean().optional(),
});

export type ProductStockUpdate = z.infer<typeof productStockUpdateSchema>;

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(["lyophilized", "capsules", "nasal-spray", "serum", "injectable", "blend"]).optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  onSale: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ProductFilter = z.infer<typeof productFilterSchema>;
