"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, ShoppingBag, ArrowRight, History, MapPin, FileText } from "lucide-react";

interface CheckoutGatewayProps {
  onContinueAsGuest: () => void;
}

export function CheckoutGateway({ onContinueAsGuest }: CheckoutGatewayProps): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSignIn = (): void => {
    const params = new URLSearchParams(searchParams);
    params.set("redirect", "/checkout");
    router.push(`/login?${params.toString()}`);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">How would you like to checkout?</h1>
          <p className="text-muted">
            Choose to sign in for a personalized experience or continue as a guest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sign In Option */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Sign In</h2>
            </div>

            <p className="text-sm text-muted mb-4">
              Already have an account? Sign in for a faster checkout experience.
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <History className="w-4 h-4 text-success" />
                <span>View order history</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-success" />
                <span>Use saved addresses</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-success" />
                <span>Download COAs anytime</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleSignIn}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-muted text-center mt-4">
              New customer?{" "}
              <Link href="/register?redirect=/checkout" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Guest Checkout Option */}
          <div className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-background-secondary flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-muted" />
              </div>
              <h2 className="text-lg font-semibold">Guest Checkout</h2>
            </div>

            <p className="text-sm text-muted mb-4">
              Checkout without creating an account. Quick and easy.
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                </div>
                <span>Quick checkout process</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                </div>
                <span>No account required</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                </div>
                <span>Track order via email</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-3 px-4 border border-border rounded-lg font-medium hover:bg-background-secondary transition-colors flex items-center justify-center gap-2"
            >
              Continue as Guest
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-muted text-center mt-4">
              You can create an account after checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
