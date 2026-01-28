import { Check, ShieldCheck, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurityDisplayProps {
  purity?: string;
  verified?: boolean;
  variant?: "default" | "compact" | "prominent";
  className?: string;
}

export function PurityDisplay({
  purity = "99%+",
  verified = true,
  variant = "default",
  className,
}: PurityDisplayProps): React.JSX.Element {
  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-purity font-medium text-sm",
          className
        )}
      >
        {verified && <Check className="w-3.5 h-3.5" />}
        <span>{purity} Purity</span>
      </span>
    );
  }

  if (variant === "prominent") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-4 bg-gradient-to-r from-purity/10 to-accent/5 border border-purity/20 rounded-lg",
          className
        )}
      >
        <div className="flex-shrink-0 w-12 h-12 bg-purity/10 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-purity" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purity">{purity}</span>
            <span className="text-sm font-medium text-foreground">Purity</span>
          </div>
          {verified && (
            <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
              <Check className="w-3 h-3 text-purity" />
              Third-party verified
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("purity-display", className)}>
      {verified ? (
        <ShieldCheck className="w-4 h-4" />
      ) : (
        <Beaker className="w-4 h-4" />
      )}
      <span>{purity} Purity</span>
      {verified && <Check className="w-3.5 h-3.5 ml-auto" />}
    </div>
  );
}
