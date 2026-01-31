"use client";

import { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";
import { Check, Clock, DollarSign, Loader2 } from "lucide-react";

interface AffiliateOrder {
  id: string;
  orderId: string;
  orderNumber: string;
  orderTotal: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  approvedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface CommissionApprovalProps {
  orders: AffiliateOrder[];
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export function CommissionApproval({
  orders,
  onStatusUpdate,
}: CommissionApprovalProps): React.ReactElement {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    orderId: string,
    newStatus: string
  ): Promise<void> => {
    setLoadingId(orderId);
    try {
      await onStatusUpdate(orderId, newStatus);
    } finally {
      setLoadingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No orders yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Orders using this affiliate code will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Commission Orders
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Total
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commission
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">
                    {order.orderNumber}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatPrice(order.orderTotal)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(order.commissionAmount)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({order.commissionRate}%)
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full capitalize",
                      statusColors[order.status] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {loadingId === order.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <div className="flex items-center gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, "approved")
                          }
                          className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </button>
                      )}
                      {order.status === "approved" && (
                        <button
                          onClick={() => handleStatusChange(order.id, "paid")}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <DollarSign className="h-3 w-3" />
                          Mark Paid
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
