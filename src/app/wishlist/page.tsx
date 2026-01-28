"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items, clearWishlist, totalItems } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-muted" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted mb-8">
            Save your favorite peptides for later by clicking the heart icon on any product.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            Browse Products
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-premium text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold">My Wishlist</h1>
          <p className="text-white/80 mt-2">
            {totalItems} {totalItems === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted">
            Your saved products. Click the heart icon to remove items.
          </p>
          <button
            type="button"
            className="text-muted hover:text-error transition-colors"
            onClick={clearWishlist}
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      </div>
    </div>
  );
}
