import { Shield, FlaskConical, Award, FileCheck, Microscope } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeType = "gmp" | "iso" | "hplc" | "third-party" | "lab-tested";

interface TrustBadgeProps {
  type: BadgeType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const badgeConfig: Record<
  BadgeType,
  { icon: typeof Shield; label: string; description: string }
> = {
  gmp: {
    icon: Shield,
    label: "GMP Certified",
    description: "Good Manufacturing Practice",
  },
  iso: {
    icon: Award,
    label: "ISO 9001",
    description: "Quality Management System",
  },
  hplc: {
    icon: FlaskConical,
    label: "HPLC Tested",
    description: "High-Performance Liquid Chromatography",
  },
  "third-party": {
    icon: FileCheck,
    label: "Third-Party Verified",
    description: "Independent Lab Testing",
  },
  "lab-tested": {
    icon: Microscope,
    label: "Lab Tested",
    description: "Rigorous Quality Control",
  },
};

const sizeStyles = {
  sm: {
    badge: "text-xs px-2 py-1 gap-1",
    icon: "w-3 h-3",
  },
  md: {
    badge: "text-sm px-3 py-1.5 gap-1.5",
    icon: "w-4 h-4",
  },
  lg: {
    badge: "text-sm px-4 py-2 gap-2",
    icon: "w-5 h-5",
  },
};

export function TrustBadge({
  type,
  size = "md",
  showLabel = true,
  className,
}: TrustBadgeProps): React.JSX.Element {
  const config = badgeConfig[type];
  const Icon = config.icon;
  const styles = sizeStyles[size];

  return (
    <div
      className={cn("trust-badge trust-badge-certified", styles.badge, className)}
      title={config.description}
    >
      <Icon className={styles.icon} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </div>
  );
}

interface TrustBadgeRowProps {
  badges?: BadgeType[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TrustBadgeRow({
  badges = ["gmp", "hplc", "third-party"],
  size = "sm",
  className,
}: TrustBadgeRowProps): React.JSX.Element {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {badges.map((type) => (
        <TrustBadge key={type} type={type} size={size} />
      ))}
    </div>
  );
}
