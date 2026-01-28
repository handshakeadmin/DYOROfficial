"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CartItemData {
  productId: string;
  quantity: number;
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

    const itemsResult = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", cartId);

    if (itemsResult.error) {
      return { items: [], cartId, error: itemsResult.error.message };
    }

    const items = itemsResult.data || [];

    return {
      items: items.map((item: { product_id: string; quantity: number }) => ({
        productId: item.product_id,
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
      .eq("product_id", productId)
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
        product_id: productId,
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
  productId: string,
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
        .eq("product_id", productId);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("cart_id", cartId)
        .eq("product_id", productId);

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
      .eq("product_id", productId);

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

    const existingResult = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("cart_id", cartId);

    const existingItems = existingResult.data || [];
    const existingMap = new Map<string, number>(
      existingItems.map((item: { product_id: string; quantity: number }) => [item.product_id, item.quantity] as [string, number])
    );

    for (const guestItem of guestItems) {
      const existingQty = existingMap.get(guestItem.productId);

      if (existingQty != null) {
        await supabase
          .from("cart_items")
          .update({ quantity: existingQty + guestItem.quantity })
          .eq("cart_id", cartId)
          .eq("product_id", guestItem.productId);
      } else {
        await supabase.from("cart_items").insert({
          cart_id: cartId,
          product_id: guestItem.productId,
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
