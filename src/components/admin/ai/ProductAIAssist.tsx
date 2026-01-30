"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAI } from "./AdminAIContext";
import { ProductAutofillData } from "@/types/admin-ai";

interface FieldSuggestion {
  field: keyof ProductAutofillData;
  label: string;
  value: string | string[];
  accepted: boolean | null;
}

interface ProductAIAssistProps {
  productName: string;
  formData: Record<string, unknown>;
  onApplyField: (field: string, value: string | string[]) => void;
  onApplyAll: (data: ProductAutofillData) => void;
}

export function ProductAIAssist({
  productName,
  formData,
  onApplyField,
  onApplyAll,
}: ProductAIAssistProps): React.ReactElement {
  const { requestAutofill, isLoading, error, clearError } = useAdminAI();
  const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autofillData, setAutofillData] = useState<ProductAutofillData | null>(null);

  const handleResearch = async (): Promise<void> => {
    if (!productName.trim()) return;

    clearError();
    setSuggestions([]);
    setAutofillData(null);

    const result = await requestAutofill(productName, formData);

    if (result) {
      setAutofillData(result);
      setIsExpanded(true);

      // Convert result to field suggestions
      const fieldLabels: Record<keyof ProductAutofillData, string> = {
        shortDescription: "Short Description",
        description: "Description",
        longDescription: "Long Description",
        researchApplications: "Research Applications",
        benefits: "Benefits",
        mechanismOfAction: "Mechanism of Action",
        dosage: "Dosage",
        storageInstructions: "Storage Instructions",
        suggestedCategory: "Suggested Category",
        molecularWeight: "Molecular Weight",
        sequence: "Sequence",
      };

      const newSuggestions: FieldSuggestion[] = [];

      for (const [key, value] of Object.entries(result)) {
        if (value && fieldLabels[key as keyof ProductAutofillData]) {
          newSuggestions.push({
            field: key as keyof ProductAutofillData,
            label: fieldLabels[key as keyof ProductAutofillData],
            value: value as string | string[],
            accepted: null,
          });
        }
      }

      setSuggestions(newSuggestions);
    }
  };

  const handleAcceptField = (index: number): void => {
    const suggestion = suggestions[index];
    onApplyField(suggestion.field, suggestion.value);
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, accepted: true } : s))
    );
  };

  const handleRejectField = (index: number): void => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, accepted: false } : s))
    );
  };

  const handleApplyAll = (): void => {
    if (!autofillData) return;
    onApplyAll(autofillData);
    setSuggestions((prev) => prev.map((s) => ({ ...s, accepted: true })));
  };

  const pendingCount = suggestions.filter((s) => s.accepted === null).length;

  const formatValue = (value: string | string[]): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">AI Research Assistant</h4>
            <p className="text-xs text-gray-500">Auto-populate product fields</p>
          </div>
        </div>

        <button
          onClick={handleResearch}
          disabled={!productName.trim() || isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            productName.trim() && !isLoading
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Research Peptide
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-t border-emerald-100">
          {/* Collapsible header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-2 flex items-center justify-between bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {suggestions.length} suggestions
              </span>
              {pendingCount > 0 && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {isExpanded && (
            <div className="px-4 pb-4">
              {/* Apply All button */}
              {pendingCount > 0 && (
                <div className="py-3 border-b border-emerald-100">
                  <button
                    onClick={handleApplyAll}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    <Check className="h-4 w-4" />
                    Apply All Suggestions
                  </button>
                </div>
              )}

              {/* Individual suggestions */}
              <div className="space-y-3 mt-3 max-h-80 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.field}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      suggestion.accepted === true
                        ? "bg-green-50 border-green-200"
                        : suggestion.accepted === false
                        ? "bg-gray-50 border-gray-200 opacity-50"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {suggestion.label}
                          </span>
                          {suggestion.accepted === true && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Applied
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {formatValue(suggestion.value)}
                        </p>
                      </div>

                      {suggestion.accepted === null && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleAcceptField(index)}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Accept"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectField(index)}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
