"use client";

import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { Eye, Package } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface UserOrderHistoryProps {
  orders: Order[];
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export function UserOrderHistory({
  orders,
  loading = false,
}: UserOrderHistoryProps): React.ReactElement {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-16" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="font-medium text-gray-900">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full capitalize",
                statusColors[order.status] || "bg-gray-100 text-gray-700"
              )}
            >
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">
              {formatPrice(order.total)}
            </span>
            <Link
              href={`/admin/orders/${order.id}`}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
