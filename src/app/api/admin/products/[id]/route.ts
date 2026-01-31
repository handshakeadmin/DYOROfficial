import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { productSchema, productStockUpdateSchema } from "@/lib/validations/product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const [imagesResult, applicationsResult] = await Promise.all([
    supabase
      .from("product_images")
      .select("id, url, alt_text, display_order, is_primary")
      .eq("product_id", id)
      .order("display_order", { ascending: true }),
    supabase
      .from("product_research_applications")
      .select("id, application")
      .eq("product_id", id),
  ]);

  const formattedProduct = {
    id: product.id,
    name: product.name,
    fullName: product.full_name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    shortDescription: product.short_description,
    longDescription: product.long_description,
    price: Number(product.price) || 0,
    originalPrice: product.original_price ? Number(product.original_price) : null,
    productType: product.product_type,
    categoryId: product.category_id,
    categoryName: product.category_name,
    dosage: product.dosage,
    form: product.form,
    purity: product.purity,
    molecularWeight: product.molecular_weight,
    sequence: product.sequence,
    storageInstructions: product.storage_instructions,
    specifications: product.specifications,
    researchApplications: (applicationsResult.data || []).map((a: { application: string }) => a.application),
    benefits: product.benefits,
    mechanismOfAction: product.mechanism_of_action,
    researchReferences: product.research_references || [],
    inStock: product.in_stock,
    stockQuantity: product.stock_quantity,
    featured: product.featured,
    bestSeller: product.best_seller,
    onSale: product.on_sale || false,
    tags: product.tags,
    images: (imagesResult.data || []).map((img: Record<string, unknown>) => ({
      id: img.id,
      url: img.url,
      altText: img.alt_text,
      displayOrder: img.display_order,
      isPrimary: img.is_primary,
    })),
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };

  return NextResponse.json(formattedProduct);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
    .neq("id", id)
    .single();

  if (existingProduct) {
    return NextResponse.json(
      { error: "Another product with this slug or SKU already exists" },
      { status: 400 }
    );
  }

  const { data: updatedProduct, error } = await supabase
    .from("products")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error || !updatedProduct) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }

  await supabase
    .from("product_research_applications")
    .delete()
    .eq("product_id", id);

  if (data.researchApplications && data.researchApplications.length > 0) {
    const applications = data.researchApplications.map((app) => ({
      product_id: id,
      application: app,
    }));

    await supabase.from("product_research_applications").insert(applications);
  }

  return NextResponse.json({ success: true, product: updatedProduct });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validationResult = productStockUpdateSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid data", details: validationResult.error.issues },
      { status: 400 }
    );
  }

  const { stockQuantity, inStock } = validationResult.data;
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {
    stock_quantity: stockQuantity,
  };

  if (inStock !== undefined) {
    updateData.in_stock = inStock;
  } else {
    updateData.in_stock = stockQuantity > 0;
  }

  const { data: updatedProduct, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select("id, stock_quantity, in_stock")
    .single();

  if (error || !updatedProduct) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    product: {
      id: updatedProduct.id,
      stockQuantity: updatedProduct.stock_quantity,
      inStock: updatedProduct.in_stock,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
