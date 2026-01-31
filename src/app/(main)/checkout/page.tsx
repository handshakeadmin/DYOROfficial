"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutGateway } from "@/components/checkout/CheckoutGateway";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { TrustBadges } from "@/components/checkout/TrustBadges";
import { MobileOrderSummary } from "@/components/checkout/MobileOrderSummary";
import { DiscountCodeInput } from "@/components/checkout/DiscountCodeInput";
import { PayPalButton } from "@/components/payment/PayPalButton";
import type { DiscountCode } from "@/lib/discount-codes";
import { calculateDiscount } from "@/lib/discount-codes";

const SHIPPING_COST = 0;
const FREE_SHIPPING_THRESHOLD = 0; // Free shipping on all orders

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface ShippingAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function CheckoutContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, isLoading: cartLoading } = useCart();
  const { user, profile, isLoading: authLoading } = useAuth();

  // Guest checkout state - skip gateway if user chooses to continue as guest
  const [continueAsGuest, setContinueAsGuest] = useState(false);

  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form for authenticated users
  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        email: user?.email || "",
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, user]);

  // Check URL for guest parameter (allows direct link to guest checkout)
  useEffect(() => {
    if (searchParams.get("guest") === "true") {
      setContinueAsGuest(true);
    }
  }, [searchParams]);

  const discountAmount = discount ? calculateDiscount(discount, subtotal) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discountAmount + shipping;

  const handleSuccess = (orderNumber: string): void => {
    // Pass guest email to success page for account creation prompt
    const params = new URLSearchParams();
    params.set("order", orderNumber);
    if (!user && customerInfo.email) {
      params.set("email", customerInfo.email);
    }
    router.push(`/checkout/success?${params.toString()}`);
  };

  const handleError = (errorMessage: string): void => {
    setError(errorMessage);
  };

  const handleContinueAsGuest = (): void => {
    setContinueAsGuest(true);
  };

  // Show loading state
  if (cartLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-background-secondary flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted mb-6">
            Add some products to your cart before checking out.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-light transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Show gateway for unauthenticated users who haven't chosen to continue as guest
  if (!user && !continueAsGuest) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Cart
            </Link>
          </div>
          <CheckoutGateway onContinueAsGuest={handleContinueAsGuest} />
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Order Summary - Collapsible at top on mobile */}
      <MobileOrderSummary
        items={items}
        subtotal={subtotal}
        discount={discount}
        discountAmount={discountAmount}
        shipping={shipping}
        total={total}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Progress Indicator */}
        <CheckoutProgress currentStep="shipping" />

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-error">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card rounded-xl border border-border p-6">
              <CheckoutForm
                initialEmail={user?.email || ""}
                initialFirstName={profile?.first_name || ""}
                initialLastName={profile?.last_name || ""}
                initialPhone={profile?.phone || ""}
                isAuthenticated={!!user}
                onCustomerInfoChange={setCustomerInfo}
                onShippingAddressChange={setShippingAddress}
                onValidationChange={setIsFormValid}
              />
            </div>

            {/* Trust Badges - Mobile (below form) */}
            <div className="mt-6 lg:hidden">
              <TrustBadges variant="grid" />
            </div>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                      <Image
                        src={item.product.images[0] || "/images/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted">{item.product.dosage}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-4">
                <DiscountCodeInput
                  orderTotal={subtotal}
                  onApply={setDiscount}
                  appliedDiscount={discount}
                />
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount ({discount?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success">Free</span>
                </div>

                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                {!isFormValid && (
                  <p className="text-sm text-muted mb-4 text-center">
                    Please complete all required fields above
                  </p>
                )}

                <PayPalButton
                  items={items}
                  subtotal={subtotal}
                  discount={discount}
                  shipping={shipping}
                  customerInfo={customerInfo}
                  shippingAddress={shippingAddress}
                  onSuccess={handleSuccess}
                  onError={handleError}
                  disabled={!isFormValid}
                />
              </div>

              {/* Trust Badges - Desktop */}
              <div className="mt-6 pt-6 border-t border-border">
                <TrustBadges variant="horizontal" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Footer CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted">Total</span>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </div>

          {!isFormValid ? (
            <button
              type="button"
              disabled
              className="w-full py-4 bg-muted/20 text-muted rounded-lg font-medium cursor-not-allowed"
            >
              Complete form to continue
            </button>
          ) : (
            <PayPalButton
              items={items}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              customerInfo={customerInfo}
              shippingAddress={shippingAddress}
              onSuccess={handleSuccess}
              onError={handleError}
              disabled={!isFormValid}
            />
          )}
        </div>

        {/* Add padding at bottom for mobile sticky footer */}
        <div className="lg:hidden h-32" />
      </div>
    </div>
  );
}

function LoadingState(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}

export default function CheckoutPage(): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingState />}>
      <CheckoutContent />
    </Suspense>
  );
}
