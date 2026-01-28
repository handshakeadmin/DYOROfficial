"use client";

import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

export default function OrdersPage(): React.JSX.Element {
  const orders: unknown[] = [];

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
          {/* Orders would be mapped here */}
        </div>
      )}
    </div>
  );
}
