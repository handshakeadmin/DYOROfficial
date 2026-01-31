"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to get product UUID from slug or ID
async function getProductUuid(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productIdOrSlug: string
): Promise<string | null> {
  // If it's already a UUID format, return as-is
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(productIdOrSlug)) {
    return productIdOrSlug;
  }

  // Otherwise, look up by slug
  const { data } = await supabase
    .from("products")
    .select("id")
    .eq("slug", productIdOrSlug)
    .single();

  return data?.id || null;
}

export async function getWishlist(): Promise<{
  items: string[];
  wishlistId: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { items: [], wishlistId: null, error: null };
    }

    const wishlistResult = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (wishlistResult.error || !wishlistResult.data) {
      return { items: [], wishlistId: null, error: null };
    }

    const wishlistId = wishlistResult.data.id;

    // Get wishlist items with product slugs via join
    const itemsResult = await supabase
      .from("wishlist_items")
      .select("product_id, products(slug)")
      .eq("wishlist_id", wishlistId);

    if (itemsResult.error) {
      return { items: [], wishlistId, error: itemsResult.error.message };
    }

    const items = itemsResult.data || [];

    // Return slugs instead of UUIDs so frontend can match with static products
    return {
      items: items.map((item: { product_id: string; products: { slug: string } | null }) =>
        item.products?.slug || item.product_id
      ),
      wishlistId,
      error: null,
    };
  } catch {
    return { items: [], wishlistId: null, error: "Failed to fetch wishlist" };
  }
}

export async function addToWishlist(
  productIdOrSlug: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the actual product UUID
    const productUuid = await getProductUuid(supabase, productIdOrSlug);
    if (!productUuid) {
      return { success: false, error: "Product not found" };
    }

    const wishlistResult = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!wishlistResult.data) {
      return { success: false, error: "Wishlist not found" };
    }

    const wishlistId = wishlistResult.data.id;

    const existingResult = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("wishlist_id", wishlistId)
      .eq("product_id", productUuid)
      .single();

    if (existingResult.data) {
      return { success: true, error: null };
    }

    const { error } = await supabase.from("wishlist_items").insert({
      wishlist_id: wishlistId,
      product_id: productUuid,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/wishlist");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to add to wishlist" };
  }
}

export async function removeFromWishlist(
  productIdOrSlug: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get the actual product UUID
    const productUuid = await getProductUuid(supabase, productIdOrSlug);
    if (!productUuid) {
      return { success: false, error: "Product not found" };
    }

    const wishlistResult = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!wishlistResult.data) {
      return { success: false, error: "Wishlist not found" };
    }

    const wishlistId = wishlistResult.data.id;

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("wishlist_id", wishlistId)
      .eq("product_id", productUuid);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/wishlist");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to remove from wishlist" };
  }
}

export async function clearWishlist(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const wishlistResult = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!wishlistResult.data) {
      return { success: false, error: "Wishlist not found" };
    }

    const wishlistId = wishlistResult.data.id;

    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("wishlist_id", wishlistId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/wishlist");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to clear wishlist" };
  }
}

export async function mergeGuestWishlist(
  guestItems: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || guestItems.length === 0) {
      return { success: true, error: null };
    }

    const wishlistResult = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!wishlistResult.data) {
      return { success: false, error: "Wishlist not found" };
    }

    const wishlistId = wishlistResult.data.id;

    // Convert slugs to UUIDs
    const productUuids: string[] = [];
    for (const item of guestItems) {
      const uuid = await getProductUuid(supabase, item);
      if (uuid) {
        productUuids.push(uuid);
      }
    }

    if (productUuids.length === 0) {
      return { success: true, error: null };
    }

    const existingResult = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("wishlist_id", wishlistId);

    const existingItems = existingResult.data || [];
    const existingSet = new Set(existingItems.map((item: { product_id: string }) => item.product_id));

    const newItems = productUuids.filter((id) => !existingSet.has(id));

    if (newItems.length > 0) {
      await supabase.from("wishlist_items").insert(
        newItems.map((productId) => ({
          wishlist_id: wishlistId,
          product_id: productId,
        }))
      );
    }

    revalidatePath("/wishlist");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to merge wishlist" };
  }
}
