"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CartItemData {
  productId: string;
  quantity: number;
}

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

export async function getCart(): Promise<{
  items: CartItemData[];
  cartId: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { items: [], cartId: null, error: null };
    }

    const cartResult = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (cartResult.error || !cartResult.data) {
      return { items: [], cartId: null, error: null };
    }

    const cartId = cartResult.data.id;

    // Get cart items with product slugs via join
    const itemsResult = await supabase
      .from("cart_items")
      .select("product_id, quantity, products(slug)")
      .eq("cart_id", cartId);

    if (itemsResult.error) {
      return { items: [], cartId, error: itemsResult.error.message };
    }

    const items = itemsResult.data || [];

    // Return slugs instead of UUIDs so frontend can match with static products
    return {
      items: items.map((item: { product_id: string; quantity: number; products: { slug: string } | null }) => ({
        productId: item.products?.slug || item.product_id,
        quantity: item.quantity,
      })),
      cartId,
      error: null,
    };
  } catch {
    return { items: [], cartId: null, error: "Failed to fetch cart" };
  }
}

export async function addToCart(
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

    const cartResult = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cartResult.data) {
      return { success: false, error: "Cart not found" };
    }

    const cartId = cartResult.data.id;

    const existingResult = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productUuid)
      .single();

    if (existingResult.data) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingResult.data.quantity + 1 })
        .eq("id", existingResult.data.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: productUuid,
        quantity: 1,
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/cart");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function updateCartItemQuantity(
  productIdOrSlug: string,
  quantity: number
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

    const cartResult = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cartResult.data) {
      return { success: false, error: "Cart not found" };
    }

    const cartId = cartResult.data.id;

    if (quantity <= 0) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId)
        .eq("product_id", productUuid);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("cart_id", cartId)
        .eq("product_id", productUuid);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePath("/cart");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to update cart item" };
  }
}

export async function removeFromCart(
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

    const cartResult = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cartResult.data) {
      return { success: false, error: "Cart not found" };
    }

    const cartId = cartResult.data.id;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId)
      .eq("product_id", productUuid);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/cart");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to remove item from cart" };
  }
}

export async function clearCart(): Promise<{
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

    const cartResult = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cartResult.data) {
      return { success: false, error: "Cart not found" };
    }

    const cartId = cartResult.data.id;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/cart");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to clear cart" };
  }
}

export async function mergeGuestCart(
  guestItems: CartItemData[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || guestItems.length === 0) {
      return { success: true, error: null };
    }

    const cartResult = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cartResult.data) {
      return { success: false, error: "Cart not found" };
    }

    const cartId = cartResult.data.id;

    // Convert slugs to UUIDs and build a map
    const itemsWithUuids: { uuid: string; quantity: number }[] = [];
    for (const item of guestItems) {
      const uuid = await getProductUuid(supabase, item.productId);
      if (uuid) {
        itemsWithUuids.push({ uuid, quantity: item.quantity });
      }
    }

    if (itemsWithUuids.length === 0) {
      return { success: true, error: null };
    }

    const existingResult = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", cartId);

    const existingItems = existingResult.data || [];
    const existingMap = new Map<string, number>(
      existingItems.map((item: { product_id: string; quantity: number }) => [item.product_id, item.quantity] as [string, number])
    );

    for (const guestItem of itemsWithUuids) {
      const existingQty = existingMap.get(guestItem.uuid);

      if (existingQty != null) {
        await supabase
          .from("cart_items")
          .update({ quantity: existingQty + guestItem.quantity })
          .eq("cart_id", cartId)
          .eq("product_id", guestItem.uuid);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: guestItem.uuid,
          quantity: guestItem.quantity,
        });
      }
    }

    revalidatePath("/cart");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to merge cart" };
  }
}
