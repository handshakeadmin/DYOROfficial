"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/data/products";
import styles from "./ChatWidget.module.css";

interface AddToCartChatButtonProps {
  productSlug: string;
  productName: string;
}

export function AddToCartChatButton({
  productSlug,
  productName,
}: AddToCartChatButtonProps): React.JSX.Element | null {
  const { addItem, openCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const product = getProductBySlug(productSlug);

  if (!product) {
    return null;
  }

  const handleAddToCart = async (): Promise<void> => {
    if (isAdded || isLoading) return;

    setIsLoading(true);

    try {
      await addItem(product);
      setIsAdded(true);
      openCart();

      // Reset after 3 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading || !product.inStock}
      className={`${styles.addToCartButton} ${isAdded ? styles.added : ""}`}
      title={`Add ${productName} to cart`}
    >
      {isLoading ? (
        "Adding..."
      ) : isAdded ? (
        "Added!"
      ) : !product.inStock ? (
        "Out of Stock"
      ) : (
        "Add"
      )}
    </button>
  );
}
