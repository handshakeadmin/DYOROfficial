"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, ShoppingBag, Clock, Truck, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image: string | null;
  quantity: number;
  price: number;
}

interface TrackingInfo {
  carrier: string;
  tracking_number: string;
  tracking_url: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  created_at: string;
  tracking: TrackingInfo | null;
  items: OrderItem[];
  item_count: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  pending: { icon: Clock, label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  processing: { icon: Package, label: "Processing", color: "text-primary", bgColor: "bg-primary/10" },
  shipped: { icon: Truck, label: "Shipped", color: "text-accent", bgColor: "bg-accent/10" },
  delivered: { icon: CheckCircle, label: "Delivered", color: "text-success", bgColor: "bg-success/10" },
  cancelled: { icon: AlertCircle, label: "Cancelled", color: "text-error", bgColor: "bg-error/10" },
  refunded: { icon: AlertCircle, label: "Refunded", color: "text-muted", bgColor: "bg-muted/10" },
};

export default function OrdersPage(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (page = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders?page=${page}&limit=10`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (newPage: number): void => {
    fetchOrders(newPage);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="text-muted mt-1">View and track your orders</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="text-muted mt-1">View and track your orders</p>
        </div>
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-error mx-auto mb-3" />
          <p className="text-error">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        <p className="text-muted mt-1">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No Orders Yet
          </h2>
          <p className="text-muted mb-6 max-w-sm mx-auto">
            When you place an order, it will appear here. Start shopping to see your
            order history.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            const statusStyle = statusConfig[order.status];

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-card rounded-xl border border-border hover:border-primary/50 transition-colors overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted">Order Number</p>
                      <p className="font-mono font-semibold">{order.order_number}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full", statusStyle?.bgColor)}>
                        <StatusIcon className={cn("w-4 h-4", statusStyle?.color)} />
                        <span className={cn("text-sm font-medium", statusStyle?.color)}>
                          {statusStyle?.label || order.status}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted hidden sm:block" />
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Order Items Preview */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Images (up to 3) */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={item.id}
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border-2 border-card"
                          style={{ zIndex: 3 - index }}
                        >
                          <Image
                            src={item.product_image || "/images/placeholder.jpg"}
                            alt={item.product_name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-background-secondary border-2 border-card flex items-center justify-center text-sm font-medium text-muted">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted">
                        {order.item_count} {order.item_count === 1 ? "item" : "items"}
                      </p>
                      {order.items.length === 1 ? (
                        <p className="font-medium truncate">{order.items[0].product_name}</p>
                      ) : (
                        <p className="font-medium truncate">
                          {order.items[0].product_name}
                          {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      {order.tracking && (
                        <p className="text-xs text-success mt-1">Tracking available</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-secondary transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-muted px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-secondary transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Track Guest Order */}
      <div className="bg-background-secondary rounded-xl p-6 text-center">
        <p className="text-sm text-muted mb-2">
          Looking for an order placed as a guest?
        </p>
        <Link
          href="/orders/track"
          className="text-primary hover:text-primary-light font-medium transition-colors"
        >
          Track a guest order
        </Link>
      </div>
    </div>
  );
}
