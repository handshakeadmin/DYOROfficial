"use client";

import { Heart } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  variant?: "icon" | "button";
  className?: string;
}

export function WishlistButton({
  product,
  variant = "button",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  if (variant === "icon") {
    return (
      <button
        type="button"
        className={cn(
          "p-2 rounded-full transition-all",
          inWishlist
            ? "bg-accent text-accent-foreground"
            : "bg-white/90 text-foreground hover:bg-accent hover:text-accent-foreground",
          className
        )}
        onClick={() => toggleItem(product)}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "p-3 border rounded-full transition-all",
        inWishlist
          ? "border-accent bg-accent/10 text-accent"
          : "border-border hover:border-accent hover:text-accent",
        className
      )}
      onClick={() => toggleItem(product)}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
    </button>
  );
}
