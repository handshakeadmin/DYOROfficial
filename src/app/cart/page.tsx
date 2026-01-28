"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-muted" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted mb-8">
            Looks like you haven&apos;t added any peptides to your cart yet.
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
          <h1 className="text-3xl lg:text-4xl font-bold">Shopping Cart</h1>
          <p className="text-white/80 mt-2">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-background-secondary text-sm font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.product.id} className="p-4">
                    <div className="sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                      {/* Product */}
                      <div className="col-span-6 flex gap-4 mb-4 sm:mb-0">
                        <div className="relative h-20 w-20 bg-background-secondary rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.product.images[0] || "/images/placeholder.jpg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:text-accent transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted mt-1">
                            {item.product.dosage} • {item.product.form}
                          </p>
                          <button
                            type="button"
                            className="sm:hidden text-sm text-error hover:underline mt-2 flex items-center gap-1"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center hidden sm:block">
                        <span className="font-medium">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border rounded-lg">
                          <button
                            type="button"
                            className="p-2 hover:bg-background-secondary transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="p-2 hover:bg-background-secondary transition-colors"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0">
                        <span className="sm:hidden text-sm text-muted">Subtotal:</span>
                        <span className="font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          className="hidden sm:block text-muted hover:text-error transition-colors"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="flex items-center justify-between mt-6">
              <Link
                href="/products"
                className="text-accent hover:underline flex items-center gap-2"
              >
                Continue Shopping
              </Link>
              <button
                type="button"
                className="text-muted hover:text-error transition-colors"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium">
                    {subtotal >= 500 ? "Free" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold">Estimated Total</span>
                  <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
                </div>
              </div>

              {subtotal < 500 && (
                <p className="text-sm text-muted mb-4">
                  Add {formatPrice(500 - subtotal)} more for free shipping!
                </p>
              )}

              <Link
                href="/checkout"
                className="block w-full py-4 bg-accent text-accent-foreground text-center font-semibold rounded-full hover:bg-accent-hover transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted text-center">
                  Secure checkout powered by industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
