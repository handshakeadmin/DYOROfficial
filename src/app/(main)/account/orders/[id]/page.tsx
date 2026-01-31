"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, Loader2, MapPin, ExternalLink } from "lucide-react";
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

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  created_at: string;
  updated_at: string;
  tracking: TrackingInfo | null;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  status_history: { status: string; timestamp: string }[];
}

const statusConfig: Record<string, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  pending: { icon: Clock, label: "Pending", color: "text-warning", bgColor: "bg-warning/10" },
  processing: { icon: Package, label: "Processing", color: "text-primary", bgColor: "bg-primary/10" },
  shipped: { icon: Truck, label: "Shipped", color: "text-accent", bgColor: "bg-accent/10" },
  delivered: { icon: CheckCircle, label: "Delivered", color: "text-success", bgColor: "bg-success/10" },
  cancelled: { icon: AlertCircle, label: "Cancelled", color: "text-error", bgColor: "bg-error/10" },
  refunded: { icon: AlertCircle, label: "Refunded", color: "text-muted", bgColor: "bg-muted/10" },
};

const statusOrder = ["pending", "processing", "shipped", "delivered"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps): React.JSX.Element {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/orders/${resolvedParams.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order");
        }

        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-error mx-auto mb-3" />
          <p className="text-error">{error || "Order not found"}</p>
          <Link
            href="/account/orders"
            className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status]?.icon || Clock;
  const statusStyle = statusConfig[order.status];
  const currentStatusIndex = statusOrder.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Order Number</p>
            <h1 className="text-2xl font-bold font-mono">{order.order_number}</h1>
            <p className="text-sm text-muted mt-1">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full", statusStyle?.bgColor)}>
            <StatusIcon className={cn("w-5 h-5", statusStyle?.color)} />
            <span className={cn("font-semibold", statusStyle?.color)}>
              {statusStyle?.label || order.status}
            </span>
          </div>
        </div>

        {/* Status Progress */}
        {!["cancelled", "refunded"].includes(order.status) && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {statusOrder.map((status, index) => {
                const config = statusConfig[status];
                const StatusStepIcon = config.icon;
                const isPast = index < currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <div className="relative w-full flex items-center">
                      {index > 0 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1",
                            isPast ? "bg-success" : "bg-border"
                          )}
                        />
                      )}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center z-10",
                          isPast && "bg-success text-white",
                          isCurrent && config.bgColor,
                          !isPast && !isCurrent && "bg-background-secondary"
                        )}
                      >
                        <StatusStepIcon
                          className={cn(
                            "w-5 h-5",
                            isPast && "text-white",
                            isCurrent && config.color,
                            !isPast && !isCurrent && "text-muted"
                          )}
                        />
                      </div>
                      {index < statusOrder.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1",
                            isPast ? "bg-success" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                    <span className={cn("text-xs mt-2 text-center", isCurrent ? "font-medium" : "text-muted")}>
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tracking Info */}
      {order.tracking && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Tracking Information
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Carrier</p>
              <p className="font-medium">{order.tracking.carrier}</p>
              <p className="text-sm text-muted mt-2">Tracking Number</p>
              <p className="font-mono text-sm">{order.tracking.tracking_number}</p>
            </div>
            <a
              href={order.tracking.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors flex items-center gap-2"
            >
              Track Package
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold">Order Items</h2>
          </div>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="p-6 flex gap-4">
                <Link
                  href={`/products/${item.product_slug}`}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={item.product_image || "/images/placeholder.jpg"}
                    alt={item.product_name}
                    fill
                    className="object-contain"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product_slug}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-sm text-muted mt-1">Quantity: {item.quantity}</p>
                  <p className="text-sm text-muted">
                    {formatPrice(item.price)} each
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
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

          {/* Shipping Address */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Address
            </h2>
            <address className="not-italic text-sm space-y-1">
              <p className="font-medium">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </p>
              <p className="text-muted">{order.shipping_address.address_line1}</p>
              {order.shipping_address.address_line2 && (
                <p className="text-muted">{order.shipping_address.address_line2}</p>
              )}
              <p className="text-muted">
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.zip_code}
              </p>
              <p className="text-muted">{order.shipping_address.country}</p>
            </address>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-background-secondary rounded-xl p-6 text-center">
        <p className="text-sm text-muted mb-2">Need help with this order?</p>
        <Link
          href="/contact"
          className="text-primary hover:text-primary-light font-medium transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
