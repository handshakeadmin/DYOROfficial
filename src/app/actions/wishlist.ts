"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

    const itemsResult = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("wishlist_id", wishlistId);

    if (itemsResult.error) {
      return { items: [], wishlistId, error: itemsResult.error.message };
    }

    const items = itemsResult.data || [];

    return {
      items: items.map((item: { product_id: string }) => item.product_id),
      wishlistId,
      error: null,
    };
  } catch {
    return { items: [], wishlistId: null, error: "Failed to fetch wishlist" };
  }
}

export async function addToWishlist(
  productId: string
): Promise<{ success: boolean; error: string | null }> {
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

    const existingResult = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("wishlist_id", wishlistId)
      .eq("product_id", productId)
      .single();

    if (existingResult.data) {
      return { success: true, error: null };
    }

    const { error } = await supabase.from("wishlist_items").insert({
      wishlist_id: wishlistId,
      product_id: productId,
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
  productId: string
): Promise<{ success: boolean; error: string | null }> {
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
      .eq("wishlist_id", wishlistId)
      .eq("product_id", productId);

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

    const existingResult = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("wishlist_id", wishlistId);

    const existingItems = existingResult.data || [];
    const existingSet = new Set(existingItems.map((item: { product_id: string }) => item.product_id));

    const newItems = guestItems.filter((id) => !existingSet.has(id));

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
