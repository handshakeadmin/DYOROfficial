"use client";

import { useState } from "react";
import { Loader2, Truck, Package, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateStatusFormProps {
  currentStatus: string;
  currentTrackingNumber: string | null;
  currentCarrier: string | null;
  onUpdate: (data: {
    status: string;
    trackingNumber?: string;
    carrier?: string;
  }) => Promise<void>;
}

const statusOptions = [
  { value: "pending", label: "Pending", icon: Package, color: "text-yellow-600" },
  { value: "processing", label: "Processing", icon: Package, color: "text-blue-600" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-purple-600" },
  { value: "delivered", label: "Delivered", icon: CheckCircle, color: "text-emerald-600" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600" },
  { value: "refunded", label: "Refunded", icon: RotateCcw, color: "text-gray-600" },
];

const carrierOptions = [
  { value: "", label: "Select Carrier" },
  { value: "usps", label: "USPS" },
  { value: "ups", label: "UPS" },
  { value: "fedex", label: "FedEx" },
  { value: "dhl", label: "DHL" },
  { value: "other", label: "Other" },
];

export function UpdateStatusForm({
  currentStatus,
  currentTrackingNumber,
  currentCarrier,
  onUpdate,
}: UpdateStatusFormProps): React.ReactElement {
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || "");
  const [carrier, setCarrier] = useState(currentCarrier || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onUpdate({
        status,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setIsLoading(false);
    }
  };

  const showTrackingFields = status === "shipped" || status === "delivered";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Status
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm",
                  status === opt.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                )}
              >
                <Icon className={cn("h-4 w-4", opt.color)} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {showTrackingFields && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {carrierOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
          Order updated successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || status === currentStatus}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Status"
        )}
      </button>
    </form>
  );
}
