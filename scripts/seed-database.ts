/**
 * Database Seeding Script for PeptideSource
 *
 * This script seeds the Supabase database with:
 * 1. Categories
 * 2. Products (from static data)
 * 3. Product images
 * 4. Research applications
 *
 * Usage: npx tsx scripts/seed-database.ts
 *
 * Requires:
 * - SUPABASE_URL environment variable
 * - SUPABASE_SERVICE_ROLE_KEY environment variable
 */

import { createClient } from "@supabase/supabase-js";
import { products, categories } from "../src/data/products";

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables:");
  console.error("- NEXT_PUBLIC_SUPABASE_URL");
  console.error("- SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Map product type from our data to database enum
function mapProductType(
  type: string
): "lyophilized" | "capsules" | "nasal-spray" | "serum" | "injectable" | "blend" {
  const typeMap: Record<string, string> = {
    lyophilized: "lyophilized",
    capsules: "capsules",
    "nasal-spray": "nasal-spray",
    serum: "serum",
    injectable: "injectable",
    blend: "blend",
  };
  return (typeMap[type] || "lyophilized") as
    | "lyophilized"
    | "capsules"
    | "nasal-spray"
    | "serum"
    | "injectable"
    | "blend";
}

async function seedCategories(): Promise<Map<string, string>> {
  console.log("\n📁 Seeding categories...");

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(
        {
          name: category.name,
          slug: category.slug,
          description: category.description,
          display_order: parseInt(category.id.replace("cat-", ""), 10),
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) {
      console.error(`  ❌ Failed to seed category ${category.name}:`, error.message);
    } else if (data) {
      categoryMap.set(category.slug, data.id);
      console.log(`  ✅ ${category.name}`);
    }
  }

  return categoryMap;
}

async function seedProducts(categoryMap: Map<string, string>): Promise<void> {
  console.log("\n📦 Seeding products...");

  for (const product of products) {
    // Get category ID from map
    const categoryId = categoryMap.get(product.category);

    // Prepare product data for database
    const productData = {
      name: product.name,
      full_name: product.fullName || product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.shortDescription,
      long_description: product.longDescription,
      price: product.price,
      original_price: product.originalPrice,
      sku: product.sku,
      product_type: mapProductType(product.type),
      category_id: categoryId,
      category_name: product.categoryDisplay || product.category,
      dosage: product.dosage,
      form: product.form,
      purity: product.purity,
      molecular_weight: product.molecularWeight,
      sequence: product.sequence,
      storage_instructions: product.storageInstructions,
      benefits: product.benefits || [],
      mechanism_of_action: product.mechanismOfAction,
      specifications: product.specifications,
      research_references: product.researchReferences || [],
      in_stock: product.inStock,
      stock_quantity: product.inStock ? 100 : 0,
      featured: product.featured,
      best_seller: product.bestSeller,
      on_sale: product.onSale,
      tags: product.tags || [],
    };

    const { data: savedProduct, error } = await supabase
      .from("products")
      .upsert(productData, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ Failed to seed product ${product.name}:`, error.message);
      continue;
    }

    if (savedProduct) {
      console.log(`  ✅ ${product.name}`);

      // Seed product images
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          const imageUrl = product.images[i];

          // Check if image already exists
          const { data: existingImage } = await supabase
            .from("product_images")
            .select("id")
            .eq("product_id", savedProduct.id)
            .eq("url", imageUrl)
            .single();

          if (!existingImage) {
            const { error: imageError } = await supabase
              .from("product_images")
              .insert({
                product_id: savedProduct.id,
                url: imageUrl,
                alt_text: `${product.name} image ${i + 1}`,
                display_order: i,
                is_primary: i === 0,
              });

            if (imageError) {
              console.error(`    ❌ Failed to add image for ${product.name}:`, imageError.message);
            }
          }
        }
      }

      // Seed research applications
      if (product.researchApplications && product.researchApplications.length > 0) {
        // First, delete existing applications for this product
        await supabase
          .from("product_research_applications")
          .delete()
          .eq("product_id", savedProduct.id);

        // Insert new applications
        const applications = product.researchApplications.map((app) => ({
          product_id: savedProduct.id,
          application: app,
        }));

        const { error: appError } = await supabase
          .from("product_research_applications")
          .insert(applications);

        if (appError) {
          console.error(
            `    ❌ Failed to add research applications for ${product.name}:`,
            appError.message
          );
        }
      }
    }
  }
}

async function seedDiscountCodes(): Promise<void> {
  console.log("\n🎫 Verifying discount codes...");

  // Discount codes are already seeded in migration 003
  // Just verify they exist
  const { data, error } = await supabase
    .from("discount_codes")
    .select("code, is_affiliate, affiliate_name, is_active");

  if (error) {
    console.error("  ❌ Failed to fetch discount codes:", error.message);
    return;
  }

  if (data && data.length > 0) {
    for (const code of data) {
      console.log(
        `  ✅ ${code.code} ${code.is_affiliate ? `(Affiliate: ${code.affiliate_name})` : ""} ${
          code.is_active ? "" : "[Inactive]"
        }`
      );
    }
  } else {
    console.log("  ℹ️ No discount codes found - they should be seeded by migration 003");
  }
}

async function createStorageBucket(): Promise<void> {
  console.log("\n🗄️ Setting up storage bucket...");

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error("  ❌ Failed to list storage buckets:", listError.message);
    return;
  }

  const productImagesBucket = buckets?.find((b) => b.id === "product-images");

  if (productImagesBucket) {
    console.log("  ✅ product-images bucket already exists");
  } else {
    const { error: createError } = await supabase.storage.createBucket("product-images", {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    if (createError) {
      console.error("  ❌ Failed to create storage bucket:", createError.message);
    } else {
      console.log("  ✅ Created product-images bucket");
    }
  }
}

async function printSummary(): Promise<void> {
  console.log("\n📊 Database Summary:");

  // Categories count
  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });
  console.log(`  Categories: ${categoriesCount || 0}`);

  // Products count
  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
  console.log(`  Products: ${productsCount || 0}`);

  // Product images count
  const { count: imagesCount } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });
  console.log(`  Product Images: ${imagesCount || 0}`);

  // Discount codes count
  const { count: codesCount } = await supabase
    .from("discount_codes")
    .select("*", { count: "exact", head: true });
  console.log(`  Discount Codes: ${codesCount || 0}`);
}

async function main(): Promise<void> {
  console.log("🌱 PeptideSource Database Seeder");
  console.log("================================");
  console.log(`Supabase URL: ${supabaseUrl}`);

  try {
    // Step 1: Create storage bucket
    await createStorageBucket();

    // Step 2: Seed categories and get mapping
    const categoryMap = await seedCategories();

    // Step 3: Seed products with category references
    await seedProducts(categoryMap);

    // Step 4: Verify discount codes
    await seedDiscountCodes();

    // Print summary
    await printSummary();

    console.log("\n✨ Seeding complete!");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
