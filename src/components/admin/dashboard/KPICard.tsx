"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "bg-emerald-100 text-emerald-600",
  loading = false,
}: KPICardProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-9 w-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs mt-0.5 font-medium",
                change.isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {change.isPositive ? "+" : ""}
              {change.value}% vs last month
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
