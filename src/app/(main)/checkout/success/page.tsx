"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, History, MapPin, FileText, Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function SuccessContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const guestEmail = searchParams.get("email");
  const { clearCart } = useCart();
  const { user } = useAuth();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleCreateAccount = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/convert-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: guestEmail,
          password,
          orderNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setAccountCreated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsCreating(false);
    }
  };

  const showAccountCreation = guestEmail && !user && !accountCreated;

  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted mb-6">
        Thank you for your purchase. Your order has been received and is being
        processed.
      </p>

      {orderNumber && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <p className="text-sm text-muted mb-1">Order Number</p>
          <p className="text-xl font-mono font-semibold text-primary">
            {orderNumber}
          </p>
        </div>
      )}

      {/* Account Creation Prompt for Guest Users */}
      {showAccountCreation && (
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Save your info for next time</h2>
              <p className="text-sm text-muted">Create an account in seconds</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <History className="w-4 h-4 text-success" />
              <span>Track all orders in one place</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-success" />
              <span>Faster checkout with saved addresses</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-success" />
              <span>Download COAs anytime</span>
            </li>
          </ul>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label htmlFor="email-display" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email-display"
                value={guestEmail}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-muted"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Create a Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-error">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCreating || password.length < 8}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
              <Link
                href="/products"
                className="px-4 py-3 border border-border rounded-lg text-sm font-medium hover:bg-background-secondary transition-colors"
              >
                No thanks
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Account Created Success */}
      {accountCreated && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 text-success mb-2">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Account Created!</span>
          </div>
          <p className="text-sm text-muted mb-4">
            Your account has been created and this order has been linked to it.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
          >
            Sign In to Your Account
          </Link>
        </div>
      )}

      <div className="bg-background-secondary rounded-xl p-6 mb-8 text-left">
        <h2 className="font-semibold mb-4">What happens next?</h2>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              1
            </span>
            <div>
              <p className="font-medium">Order Confirmation</p>
              <p className="text-sm text-muted">
                You&apos;ll receive an email confirmation shortly with your order
                details.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              2
            </span>
            <div>
              <p className="font-medium">Processing</p>
              <p className="text-sm text-muted">
                Our team will prepare your order with care and quality
                assurance.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
              3
            </span>
            <div>
              <p className="font-medium">Shipping</p>
              <p className="text-sm text-muted">
                Once shipped, you&apos;ll receive tracking information via email.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          Continue Shopping
        </Link>
        {user ? (
          <Link
            href="/account/orders"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-background-secondary transition-colors"
          >
            View Orders
          </Link>
        ) : (
          <Link
            href="/orders/track"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-background-secondary transition-colors"
          >
            Track Order
          </Link>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <p className="text-sm text-muted mb-4">
          Questions about your order?
        </p>
        <Link
          href="/contact"
          className="text-primary hover:text-primary-light transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

function LoadingState(): React.JSX.Element {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Processing...</h1>
      <p className="text-muted">Please wait while we confirm your order.</p>
    </div>
  );
}

export default function CheckoutSuccessPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Suspense fallback={<LoadingState />}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
