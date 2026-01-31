import type { Product, ProductCategory, ProductType } from "@/types";
import {
  products as staticProducts,
  getProductById as getStaticProductById,
  getProductBySlug as getStaticProductBySlug,
} from "@/data/products";

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  original_price: number | null;
  sku: string;
  product_type: ProductType;
  category_name: string;
  dosage: string;
  form: string;
  purity: string;
  molecular_weight: string | null;
  sequence: string | null;
  storage_instructions: string;
  in_stock: boolean;
  featured: boolean;
  best_seller: boolean;
  created_at: string;
  updated_at: string;
}

// Map category display names to ProductCategory type
function mapCategoryToProductCategory(categoryName: string): ProductCategory {
  const normalized = categoryName.toLowerCase().replace(/\s+/g, '-');
  const categoryMap: Record<string, ProductCategory> = {
    'metabolic': 'metabolic',
    'recovery': 'recovery',
    'cognitive': 'cognitive',
    'growth-hormone': 'growth-hormone',
    'growth hormone': 'growth-hormone',
    'blends': 'blends',
    'healing & recovery': 'recovery',
    'skin & anti-aging': 'recovery',
    'anti-aging': 'metabolic',
    'nootropics': 'cognitive',
    'sexual health': 'metabolic',
  };
  return categoryMap[normalized] || 'metabolic';
}

interface DbProductImage {
  product_id: string;
  url: string;
}

interface DbProductApplication {
  product_id: string;
  application: string;
}

function mapDbProductToProduct(
  dbProduct: DbProduct,
  images: DbProductImage[],
  applications: DbProductApplication[]
): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description,
    shortDescription: dbProduct.short_description,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price ?? undefined,
    sku: dbProduct.sku,
    type: dbProduct.product_type,
    category: mapCategoryToProductCategory(dbProduct.category_name),
    categoryDisplay: dbProduct.category_name,
    dosage: dbProduct.dosage,
    form: dbProduct.form,
    purity: dbProduct.purity,
    molecularWeight: dbProduct.molecular_weight ?? undefined,
    sequence: dbProduct.sequence ?? undefined,
    storageInstructions: dbProduct.storage_instructions,
    researchApplications: applications.map((app) => app.application),
    images: images.length > 0 ? images.map((img) => img.url) : ["/images/placeholder.jpg"],
    inStock: dbProduct.in_stock,
    featured: dbProduct.featured,
    bestSeller: dbProduct.best_seller,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return staticProducts;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !dbProducts || dbProducts.length === 0) {
      return staticProducts;
    }

    const productIds = dbProducts.map((p: DbProduct) => p.id);

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .in("product_id", productIds),
    ]);

    return dbProducts.map((dbProduct: DbProduct) => {
      const productImages = (images || []).filter(
        (img: DbProductImage) => img.product_id === dbProduct.id
      );
      const productApps = (applications || []).filter(
        (app: DbProductApplication) => app.product_id === dbProduct.id
      );
      return mapDbProductToProduct(dbProduct, productImages, productApps);
    });
  } catch {
    return staticProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) {
    return getStaticProductBySlug(slug);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProduct, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !dbProduct) {
      return getStaticProductBySlug(slug);
    }

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", dbProduct.id)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .eq("product_id", dbProduct.id),
    ]);

    return mapDbProductToProduct(dbProduct, images || [], applications || []);
  } catch {
    return getStaticProductBySlug(slug);
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured) {
    return getStaticProductById(id);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProduct, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !dbProduct) {
      return getStaticProductById(id);
    }

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", dbProduct.id)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .eq("product_id", dbProduct.id),
    ]);

    return mapDbProductToProduct(dbProduct, images || [], applications || []);
  } catch {
    return getStaticProductById(id);
  }
}

export async function getProductsByType(type: string): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return staticProducts.filter((p) => p.type === type);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_type", type)
      .order("created_at", { ascending: false });

    if (error || !dbProducts || dbProducts.length === 0) {
      return staticProducts.filter((p) => p.type === type);
    }

    const productIds = dbProducts.map((p: DbProduct) => p.id);

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .in("product_id", productIds),
    ]);

    return dbProducts.map((dbProduct: DbProduct) => {
      const productImages = (images || []).filter(
        (img: DbProductImage) => img.product_id === dbProduct.id
      );
      const productApps = (applications || []).filter(
        (app: DbProductApplication) => app.product_id === dbProduct.id
      );
      return mapDbProductToProduct(dbProduct, productImages, productApps);
    });
  } catch {
    return staticProducts.filter((p) => p.type === type);
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return staticProducts.filter((p) => p.featured);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error || !dbProducts || dbProducts.length === 0) {
      return staticProducts.filter((p) => p.featured);
    }

    const productIds = dbProducts.map((p: DbProduct) => p.id);

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .in("product_id", productIds),
    ]);

    return dbProducts.map((dbProduct: DbProduct) => {
      const productImages = (images || []).filter(
        (img: DbProductImage) => img.product_id === dbProduct.id
      );
      const productApps = (applications || []).filter(
        (app: DbProductApplication) => app.product_id === dbProduct.id
      );
      return mapDbProductToProduct(dbProduct, productImages, productApps);
    });
  } catch {
    return staticProducts.filter((p) => p.featured);
  }
}

export async function getBestSellers(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return staticProducts.filter((p) => p.bestSeller);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .eq("best_seller", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error || !dbProducts || dbProducts.length === 0) {
      return staticProducts.filter((p) => p.bestSeller);
    }

    const productIds = dbProducts.map((p: DbProduct) => p.id);

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .in("product_id", productIds),
    ]);

    return dbProducts.map((dbProduct: DbProduct) => {
      const productImages = (images || []).filter(
        (img: DbProductImage) => img.product_id === dbProduct.id
      );
      const productApps = (applications || []).filter(
        (app: DbProductApplication) => app.product_id === dbProduct.id
      );
      return mapDbProductToProduct(dbProduct, productImages, productApps);
    });
  } catch {
    return staticProducts.filter((p) => p.bestSeller);
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const lowerQuery = query.toLowerCase();

  if (!isSupabaseConfigured) {
    return staticProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.categoryDisplay.toLowerCase().includes(lowerQuery)
    );
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: dbProducts, error } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,category_name.ilike.%${lowerQuery}%`)
      .order("created_at", { ascending: false });

    if (error || !dbProducts || dbProducts.length === 0) {
      return staticProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.categoryDisplay.toLowerCase().includes(lowerQuery)
      );
    }

    const productIds = dbProducts.map((p: DbProduct) => p.id);

    const [{ data: images }, { data: applications }] = await Promise.all([
      supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("display_order", { ascending: true }),
      supabase
        .from("product_research_applications")
        .select("*")
        .in("product_id", productIds),
    ]);

    return dbProducts.map((dbProduct: DbProduct) => {
      const productImages = (images || []).filter(
        (img: DbProductImage) => img.product_id === dbProduct.id
      );
      const productApps = (applications || []).filter(
        (app: DbProductApplication) => app.product_id === dbProduct.id
      );
      return mapDbProductToProduct(dbProduct, productImages, productApps);
    });
  } catch {
    return staticProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.categoryDisplay.toLowerCase().includes(lowerQuery)
    );
  }
}
