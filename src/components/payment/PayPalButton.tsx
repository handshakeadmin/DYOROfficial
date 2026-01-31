"use client";

import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import type { CartItem } from "@/types";
import type { DiscountCode } from "@/lib/discount-codes";
import { calculateDiscount } from "@/lib/discount-codes";

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PayPalButtonProps {
  items: CartItem[];
  subtotal: number;
  discount: DiscountCode | null;
  shipping: number;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  onSuccess: (orderNumber: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

function ButtonWrapper({
  items,
  subtotal,
  discount,
  shipping,
  customerInfo,
  shippingAddress,
  onSuccess,
  onError,
  disabled,
}: PayPalButtonProps): React.JSX.Element {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  const discountAmount = discount ? calculateDiscount(discount, subtotal) : 0;
  const total = subtotal - discountAmount + shipping;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className={disabled || isProcessing ? "opacity-50 pointer-events-none" : ""}>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
        }}
        disabled={disabled || isProcessing}
        createOrder={async () => {
          const paypalItems = items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: item.product.price.toFixed(2),
            },
            sku: item.product.sku,
          }));

          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: paypalItems,
              subtotal: subtotal.toFixed(2),
              shipping: shipping.toFixed(2),
              discount: discountAmount.toFixed(2),
              total: total.toFixed(2),
            }),
          });

          const data = await response.json();

          if (data.error) {
            onError(data.error);
            throw new Error(data.error);
          }

          return data.id;
        }}
        onApprove={async (data) => {
          setIsProcessing(true);

          try {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderID,
                customerInfo,
                shippingAddress,
                cartItems: items.map((item) => ({
                  productId: item.product.id,
                  productName: item.product.name,
                  quantity: item.quantity,
                  price: item.product.price,
                })),
                subtotal,
                discount: discountAmount,
                discountCode: discount?.code,
                shipping,
                total,
              }),
            });

            const result = await response.json();

            if (result.success) {
              onSuccess(result.orderNumber);
            } else {
              onError(result.error || "Payment failed");
            }
          } catch {
            onError("An error occurred while processing your payment");
          } finally {
            setIsProcessing(false);
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          onError("Payment was cancelled or failed");
        }}
        onCancel={() => {
          onError("Payment was cancelled");
        }}
      />
    </div>
  );
}

export function PayPalButton(props: PayPalButtonProps): React.JSX.Element {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg text-center">
        <p className="text-sm text-warning">
          PayPal is not configured. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <ButtonWrapper {...props} />
    </PayPalScriptProvider>
  );
}
