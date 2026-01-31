"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

interface TrackingInfo {
  carrier: string;
  tracking_number: string;
  tracking_url: string;
}

interface OrderData {
  order_number: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  tracking?: TrackingInfo;
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  pending: { icon: Clock, label: "Pending", color: "text-warning" },
  processing: { icon: Package, label: "Processing", color: "text-primary" },
  shipped: { icon: Truck, label: "Shipped", color: "text-accent" },
  delivered: { icon: CheckCircle, label: "Delivered", color: "text-success" },
  cancelled: { icon: AlertCircle, label: "Cancelled", color: "text-error" },
  refunded: { icon: AlertCircle, label: "Refunded", color: "text-muted" },
};

export default function TrackOrderPage(): React.JSX.Element {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to find order");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find order");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = order ? statusConfig[order.status]?.icon || Clock : Clock;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted">
            Enter your order number and email address to view your order status.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium mb-1">
                Order Number <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="PS-XXXXXX"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !orderNumber || !email}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Order
                </>
              )}
            </button>
          </div>
        </form>

        {/* Order Result */}
        {order && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted">Order Number</p>
                  <p className="font-mono font-semibold text-lg">{order.order_number}</p>
                </div>
                <div className={cn("flex items-center gap-2", statusConfig[order.status]?.color)}>
                  <StatusIcon className="w-5 h-5" />
                  <span className="font-medium">{statusConfig[order.status]?.label || order.status}</span>
                </div>
              </div>

              <p className="text-sm text-muted">
                Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Tracking Info */}
            {order.tracking && (
              <div className="p-6 border-b border-border bg-background-secondary">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Tracking Information
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Carrier</p>
                    <p className="font-medium">{order.tracking.carrier}</p>
                  </div>
                  <a
                    href={order.tracking.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
                  >
                    Track Package
                  </a>
                </div>
                <p className="text-sm text-muted mt-2">
                  Tracking #: <span className="font-mono">{order.tracking.tracking_number}</span>
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                      <Image
                        src={item.product_image || "/images/placeholder.jpg"}
                        alt={item.product_name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_name}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sign In Prompt */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted mb-2">Have an account?</p>
          <Link
            href="/login?redirect=/account/orders"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            Sign in to view all orders
          </Link>
        </div>
      </div>
    </div>
  );
}
