"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 500);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Quantity Selector */}
      <div className="flex items-center border rounded-lg">
        <button
          type="button"
          className="p-3 hover:bg-background-secondary transition-colors disabled:opacity-50"
          onClick={decrementQuantity}
          disabled={quantity <= 1 || !product.inStock}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <button
          type="button"
          className="p-3 hover:bg-background-secondary transition-colors disabled:opacity-50"
          onClick={incrementQuantity}
          disabled={!product.inStock}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        className={cn(
          "flex-1 py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all",
          added
            ? "bg-success text-white"
            : product.inStock
            ? "bg-accent text-accent-foreground hover:bg-accent-hover"
            : "bg-muted text-white cursor-not-allowed"
        )}
        onClick={handleAddToCart}
        disabled={!product.inStock || added}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Added!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </>
        )}
      </button>
    </div>
  );
}
