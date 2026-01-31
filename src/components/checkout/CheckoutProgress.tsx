"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStep = "contact" | "shipping" | "payment";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

const steps: { id: CheckoutStep; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps): React.JSX.Element {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center">
                <span
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                    isCompleted && "bg-success text-white",
                    isCurrent && "bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "bg-background-secondary text-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "ml-2 text-sm font-medium hidden sm:inline",
                    isCurrent && "text-foreground",
                    !isCurrent && "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 transition-colors",
                    index < currentIndex ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
