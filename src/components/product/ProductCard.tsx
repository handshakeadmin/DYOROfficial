"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, ShieldCheck, FileText } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps): React.JSX.Element {
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    openCart();
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card-hover bg-card rounded-xl border overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-white p-2">
          <Image
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded">
                Best Seller
              </span>
            )}
            {product.originalPrice && (
              <span className="px-2 py-1 bg-white/90 text-error text-xs font-medium rounded border border-error/20">
                Sale
              </span>
            )}
            {!product.inStock && (
              <span className="px-2 py-1 bg-muted text-white text-xs font-semibold rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-all",
              inWishlist
                ? "bg-accent text-accent-foreground"
                : "bg-white/90 text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              className="w-full py-2 bg-white/95 text-primary font-medium text-sm rounded-lg flex items-center justify-center gap-2 border border-border hover:bg-accent hover:text-white hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-muted uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Dosage & Form */}
          <p className="text-sm text-muted mt-1">
            {product.dosage} • {product.type === "lyophilized" ? "Lyophilized" : product.form}
          </p>

          {/* Purity & COA */}
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-purity font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              {product.purity}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-certification">
              <FileText className="w-3 h-3" />
              COA
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
