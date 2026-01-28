import type { ReactNode } from "react";
import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <FlaskConical className="w-10 h-10 text-primary" />
            <span className="text-2xl font-bold">
              <span className="text-primary">Peptide</span>
              <span className="text-accent">Source</span>
            </span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          {children}
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center gap-6 text-xs text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-verified" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure Login
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-verified" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            256-bit Encryption
          </span>
        </div>
      </div>
    </div>
  );
}
