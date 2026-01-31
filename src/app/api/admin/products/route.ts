import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations/product";

export interface AdminProduct {
  id: string;
  name: string;
  fullName: string | null;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  longDescription: string | null;
  price: number;
  originalPrice: number | null;
  productType: string;
  categoryId: string | null;
  categoryName: string;
  dosage: string;
  form: string;
  purity: string;
  molecularWeight: string | null;
  sequence: string | null;
  storageInstructions: string;
  specifications: string | null;
  researchApplications: string[];
  benefits: string[] | null;
  mechanismOfAction: string | null;
  researchReferences: Array<{ title: string; url: string; source: string }>;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  bestSeller: boolean;
  onSale: boolean;
  tags: string[] | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const inStock = searchParams.get("inStock");
  const featured = searchParams.get("featured");
  const lowStock = searchParams.get("lowStock");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select(
      `
      id,
      name,
      full_name,
      slug,
      sku,
      description,
      short_description,
      long_description,
      price,
      original_price,
      product_type,
      category_id,
      category_name,
      dosage,
      form,
      purity,
      molecular_weight,
      sequence,
      storage_instructions,
      specifications,
      benefits,
      mechanism_of_action,
      research_references,
      in_stock,
      stock_quantity,
      featured,
      best_seller,
      on_sale,
      tags,
      created_at,
      updated_at
    `,
      { count: "exact" }
    )
    .order("name", { ascending: true });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (category) {
    query = query.eq("category_name", category);
  }

  if (type) {
    query = query.eq("product_type", type);
  }

  if (inStock === "true") {
    query = query.eq("in_stock", true);
  } else if (inStock === "false") {
    query = query.eq("in_stock", false);
  }

  if (featured === "true") {
    query = query.eq("featured", true);
  }

  if (lowStock === "true") {
    query = query.or("stock_quantity.lte.5,in_stock.eq.false");
  }

  query = query.range(offset, offset + limit - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  const productIds = (products || []).map((p: { id: string }) => p.id);
  let imagesMap: Record<string, string[]> = {};
  let applicationsMap: Record<string, string[]> = {};

  if (productIds.length > 0) {
    const [imagesResult, applicationsResult] = await Promise.all([
      supabase
        .from("product_images")
        .select("product_id, url")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("product_id, application")
        .in("product_id", productIds),
    ]);

    imagesMap = (imagesResult.data || []).reduce(
      (acc: Record<string, string[]>, img: { product_id: string; url: string }) => {
        if (!acc[img.product_id]) acc[img.product_id] = [];
        acc[img.product_id].push(img.url);
        return acc;
      },
      {} as Record<string, string[]>
    );

    applicationsMap = (applicationsResult.data || []).reduce(
      (acc: Record<string, string[]>, app: { product_id: string; application: string }) => {
        if (!acc[app.product_id]) acc[app.product_id] = [];
        acc[app.product_id].push(app.application);
        return acc;
      },
      {} as Record<string, string[]>
    );
  }

  const formattedProducts: AdminProduct[] = (products || []).map((p: Record<string, unknown>) => ({
    id: p.id,
    name: p.name,
    fullName: p.full_name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.short_description,
    longDescription: p.long_description,
    price: Number(p.price) || 0,
    originalPrice: p.original_price ? Number(p.original_price) : null,
    productType: p.product_type,
    categoryId: p.category_id,
    categoryName: p.category_name,
    dosage: p.dosage,
    form: p.form,
    purity: p.purity,
    molecularWeight: p.molecular_weight,
    sequence: p.sequence,
    storageInstructions: p.storage_instructions,
    specifications: p.specifications,
    researchApplications: applicationsMap[p.id as string] || [],
    benefits: p.benefits,
    mechanismOfAction: p.mechanism_of_action,
    researchReferences: p.research_references || [],
    inStock: p.in_stock,
    stockQuantity: p.stock_quantity,
    featured: p.featured,
    bestSeller: p.best_seller,
    onSale: p.on_sale || false,
    tags: p.tags,
    images: imagesMap[p.id as string] || [],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));

  return NextResponse.json({
    products: formattedProducts,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validationResult = productSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validationResult.error.issues },
      { status: 400 }
    );
  }

  const data = validationResult.data;
  const supabase = await createClient();

  const { data: existingProduct } = await supabase
    .from("products")
    .select("id")
    .or(`slug.eq.${data.slug},sku.eq.${data.sku}`)
    .single();

  if (existingProduct) {
    return NextResponse.json(
      { error: "A product with this slug or SKU already exists" },
      { status: 400 }
    );
  }

  const { data: newProduct, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      full_name: data.fullName,
      slug: data.slug,
      sku: data.sku,
      description: data.description,
      short_description: data.shortDescription,
      long_description: data.longDescription,
      price: data.price,
      original_price: data.originalPrice,
      product_type: data.productType,
      category_id: data.categoryId,
      category_name: data.categoryName,
      dosage: data.dosage,
      form: data.form,
      purity: data.purity,
      molecular_weight: data.molecularWeight,
      sequence: data.sequence,
      storage_instructions: data.storageInstructions,
      specifications: data.specifications,
      benefits: data.benefits,
      mechanism_of_action: data.mechanismOfAction,
      research_references: data.researchReferences || [],
      in_stock: data.inStock,
      stock_quantity: data.stockQuantity,
      featured: data.featured,
      best_seller: data.bestSeller,
      on_sale: data.onSale,
      tags: data.tags,
    })
    .select()
    .single();

  if (error || !newProduct) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }

  if (data.researchApplications && data.researchApplications.length > 0) {
    const applications = data.researchApplications.map((app) => ({
      product_id: newProduct.id,
      application: app,
    }));

    await supabase.from("product_research_applications").insert(applications);
  }

  return NextResponse.json({ success: true, product: newProduct });
}
