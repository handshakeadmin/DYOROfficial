import {
  Shield,
  FlaskConical,
  Award,
  FileCheck,
  Microscope,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CertificationType =
  | "gmp"
  | "iso-9001"
  | "iso-17025"
  | "hplc"
  | "third-party"
  | "fda-registered"
  | "clia";

interface CertificationBadgeProps {
  type: CertificationType;
  variant?: "default" | "compact";
  className?: string;
}

const certificationConfig: Record<
  CertificationType,
  {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    color: string;
  }
> = {
  gmp: {
    icon: Shield,
    title: "GMP",
    subtitle: "Certified",
    color: "text-primary",
  },
  "iso-9001": {
    icon: Award,
    title: "ISO 9001",
    subtitle: "Quality Management",
    color: "text-certification",
  },
  "iso-17025": {
    icon: Award,
    title: "ISO 17025",
    subtitle: "Lab Accreditation",
    color: "text-certification",
  },
  hplc: {
    icon: FlaskConical,
    title: "HPLC",
    subtitle: "Verified Purity",
    color: "text-accent",
  },
  "third-party": {
    icon: FileCheck,
    title: "Third-Party",
    subtitle: "Lab Tested",
    color: "text-verified",
  },
  "fda-registered": {
    icon: Building2,
    title: "FDA",
    subtitle: "Registered",
    color: "text-primary",
  },
  clia: {
    icon: Microscope,
    title: "CLIA",
    subtitle: "Certified Lab",
    color: "text-secondary",
  },
};

export function CertificationBadge({
  type,
  variant = "default",
  className,
}: CertificationBadgeProps): React.JSX.Element {
  const config = certificationConfig[type];
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium",
          config.color,
          className
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{config.title}</span>
      </div>
    );
  }

  return (
    <div className={cn("certification-item", className)}>
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center bg-current/10",
          config.color
        )}
      >
        <Icon className={cn("w-5 h-5", config.color)} />
      </div>
      <div>
        <p className={cn("font-semibold text-sm", config.color)}>{config.title}</p>
        <p className="text-xs text-muted">{config.subtitle}</p>
      </div>
    </div>
  );
}

interface CertificationGridProps {
  certifications?: CertificationType[];
  variant?: "default" | "compact";
  className?: string;
}

export function CertificationGrid({
  certifications = ["gmp", "iso-9001", "hplc", "third-party"],
  variant = "default",
  className,
}: CertificationGridProps): React.JSX.Element {
  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center gap-4", className)}>
        {certifications.map((type) => (
          <CertificationBadge key={type} type={type} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("certification-grid", className)}>
      {certifications.map((type) => (
        <CertificationBadge key={type} type={type} />
      ))}
    </div>
  );
}
