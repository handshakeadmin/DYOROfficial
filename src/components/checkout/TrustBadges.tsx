"use client";

import { Shield, Lock, Award, CheckCircle } from "lucide-react";

interface TrustBadgesProps {
  variant?: "horizontal" | "grid";
}

const badges = [
  {
    icon: Lock,
    title: "256-bit SSL",
    description: "Encryption",
  },
  {
    icon: Shield,
    title: "PayPal",
    description: "Buyer Protection",
  },
  {
    icon: Award,
    title: "COA Included",
    description: "Every Order",
  },
  {
    icon: CheckCircle,
    title: "99%+ Purity",
    description: "Verified",
  },
];

export function TrustBadges({ variant = "horizontal" }: TrustBadgesProps): React.JSX.Element {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="flex items-center gap-2 p-3 bg-background-secondary rounded-lg"
          >
            <badge.icon className="w-5 h-5 text-success flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{badge.title}</p>
              <p className="text-xs text-muted truncate">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {badges.map((badge) => (
        <div key={badge.title} className="flex items-center gap-1.5 text-xs text-muted">
          <badge.icon className="w-4 h-4 text-success" />
          <span>{badge.title}</span>
        </div>
      ))}
    </div>
  );
}
