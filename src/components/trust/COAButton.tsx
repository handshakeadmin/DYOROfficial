"use client";

import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface COAButtonProps {
  coaUrl?: string | null;
  hplcUrl?: string | null;
  productName?: string;
  batchNumber?: string;
  variant?: "default" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function COAButton({
  coaUrl,
  hplcUrl,
  productName = "Product",
  batchNumber,
  variant = "default",
  size = "md",
  className,
}: COAButtonProps): React.JSX.Element | null {
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const hasDocuments = coaUrl || hplcUrl;

  if (!hasDocuments) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-muted text-sm",
          className
        )}
      >
        <FileText className="w-4 h-4" />
        COA Available Upon Request
      </span>
    );
  }

  const handleDownload = async (url: string, type: string): Promise<void> => {
    setIsLoading(true);
    try {
      window.open(url, "_blank");
    } finally {
      setIsLoading(false);
      setShowDropdown(false);
    }
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-3.5 py-2",
    lg: "text-base px-4 py-2.5",
  };

  const variantStyles = {
    default: "coa-button",
    outline:
      "inline-flex items-center gap-1.5 border border-primary text-primary rounded font-medium hover:bg-primary/5 transition-colors",
    text: "inline-flex items-center gap-1.5 text-primary hover:underline font-medium",
  };

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  if (coaUrl && hplcUrl) {
    return (
      <div className={cn("relative inline-block", className)}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={cn(variantStyles[variant], sizeStyles[size])}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className={cn(iconSize, "animate-spin")} />
          ) : (
            <FileText className={iconSize} />
          )}
          <span>View Documents</span>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[180px] py-1">
              <button
                onClick={() => handleDownload(coaUrl, "COA")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-primary" />
                Certificate of Analysis
                <ExternalLink className="w-3 h-3 ml-auto text-muted" />
              </button>
              <button
                onClick={() => handleDownload(hplcUrl, "HPLC")}
                className="w-full px-4 py-2 text-left text-sm hover:bg-background-secondary flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-primary" />
                HPLC Report
                <ExternalLink className="w-3 h-3 ml-auto text-muted" />
              </button>
              {batchNumber && (
                <div className="border-t border-border mt-1 pt-1 px-4 py-2">
                  <p className="text-xs text-muted">
                    Batch: <span className="font-mono">{batchNumber}</span>
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  const url = coaUrl || hplcUrl;
  const label = coaUrl ? "View COA" : "View HPLC Report";

  return (
    <button
      onClick={() => url && handleDownload(url, coaUrl ? "COA" : "HPLC")}
      className={cn(variantStyles[variant], sizeStyles[size], className)}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <FileText className={iconSize} />
      )}
      <span>{label}</span>
    </button>
  );
}
