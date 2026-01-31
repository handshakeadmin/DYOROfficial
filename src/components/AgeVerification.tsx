"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const STORAGE_KEY = "dyorwellness-age-verified";

export function AgeVerification(): React.JSX.Element | null {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isDeclined, setIsDeclined] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    setIsVerified(verified === "true");
  }, []);

  const handleVerify = (): void => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVerified(true);
  };

  const handleDecline = (): void => {
    setIsDeclined(true);
  };

  // Still checking localStorage
  if (isVerified === null) {
    return null;
  }

  // Already verified
  if (isVerified) {
    return null;
  }

  // User declined
  if (isDeclined) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 bg-error/10 rounded flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-error" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
            <p className="text-muted mt-2">
              You must be 21 years or older to access this website.
            </p>
          </div>
          <button
            onClick={() => setIsDeclined(false)}
            className="text-sm text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-md shadow-sm max-w-md w-full p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/dyorlogo.jpeg"
              alt="DYOR Wellness"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-3xl font-bold" style={{ color: '#1e40af' }}>DYOR</span>
            <span className="text-3xl font-bold" style={{ color: '#3b82f6' }}>Wellness</span>
          </div>
        </div>

        {/* Age Gate Content */}
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>

          <h2 className="text-xl font-semibold text-foreground">
            Age Verification Required
          </h2>

          <p className="text-sm text-muted">
            This website sells research peptides intended for laboratory and
            scientific research purposes only. You must be at least 21 years
            of age to enter.
          </p>

          <div className="bg-background-secondary border border-border rounded p-3 text-xs text-muted">
            <p className="font-medium text-foreground mb-1">Research Use Only</p>
            <p>
              Products sold on this site are not intended for human or veterinary
              use, and are strictly for in-vitro research and laboratory purposes.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleVerify}
            className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded hover:bg-primary-light transition-colors"
          >
            I am 21 or older
          </button>
          <button
            onClick={handleDecline}
            className="w-full py-2.5 bg-background-secondary text-foreground font-medium rounded border border-border hover:bg-background-tertiary transition-colors"
          >
            I am under 21
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted mt-6">
          By entering, you agree to our{" "}
          <span className="text-primary">Terms of Service</span> and confirm
          you are a qualified researcher.
        </p>
      </div>
    </div>
  );
}
