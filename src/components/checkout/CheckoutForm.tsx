"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SavedAddressSelector } from "./SavedAddressSelector";

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

interface SavedAddress {
  id: string;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

interface CheckoutFormProps {
  initialEmail?: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialPhone?: string;
  isAuthenticated?: boolean;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onShippingAddressChange: (address: ShippingAddress) => void;
  onValidationChange: (isValid: boolean) => void;
  onSaveAddressChange?: (save: boolean) => void;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

interface FieldValidation {
  isValid: boolean;
  isTouched: boolean;
  error: string;
}

type FieldValidations = Record<string, FieldValidation>;

export function CheckoutForm({
  initialEmail = "",
  initialFirstName = "",
  initialLastName = "",
  initialPhone = "",
  isAuthenticated = false,
  onCustomerInfoChange,
  onShippingAddressChange,
  onValidationChange,
  onSaveAddressChange,
}: CheckoutFormProps): React.JSX.Element {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: initialEmail,
    firstName: initialFirstName,
    lastName: initialLastName,
    phone: initialPhone,
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  const [fieldValidations, setFieldValidations] = useState<FieldValidations>({
    email: { isValid: false, isTouched: false, error: "" },
    firstName: { isValid: false, isTouched: false, error: "" },
    lastName: { isValid: false, isTouched: false, error: "" },
    phone: { isValid: true, isTouched: false, error: "" },
    addressLine1: { isValid: false, isTouched: false, error: "" },
    city: { isValid: false, isTouched: false, error: "" },
    state: { isValid: false, isTouched: false, error: "" },
    zipCode: { isValid: false, isTouched: false, error: "" },
  });

  // Update form when initial values change (e.g., when user profile loads)
  useEffect(() => {
    if (initialEmail || initialFirstName || initialLastName || initialPhone) {
      const updated = {
        email: initialEmail,
        firstName: initialFirstName,
        lastName: initialLastName,
        phone: initialPhone,
      };
      setCustomerInfo(updated);
      onCustomerInfoChange(updated);

      // Validate initial values
      setFieldValidations((prev) => ({
        ...prev,
        email: { ...prev.email, isValid: validateEmail(initialEmail) },
        firstName: { ...prev.firstName, isValid: !!initialFirstName.trim() },
        lastName: { ...prev.lastName, isValid: !!initialLastName.trim() },
      }));
    }
  }, [initialEmail, initialFirstName, initialLastName, initialPhone, onCustomerInfoChange]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateZipCode = (zip: string): boolean => {
    return /^\d{5}(-\d{4})?$/.test(zip);
  };

  const validateField = (field: string, value: string): FieldValidation => {
    let isValid = false;
    let error = "";

    switch (field) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Enter a valid email (e.g., name@example.com)";
        } else {
          isValid = true;
        }
        break;
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else {
          isValid = true;
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else {
          isValid = true;
        }
        break;
      case "phone":
        // Phone is optional, so always valid
        isValid = true;
        break;
      case "addressLine1":
        if (!value.trim()) {
          error = "Street address is required";
        } else {
          isValid = true;
        }
        break;
      case "city":
        if (!value.trim()) {
          error = "City is required";
        } else {
          isValid = true;
        }
        break;
      case "state":
        if (!value) {
          error = "State is required";
        } else {
          isValid = true;
        }
        break;
      case "zipCode":
        if (!value) {
          error = "ZIP code is required";
        } else if (!validateZipCode(value)) {
          error = "Enter a 5-digit ZIP (e.g., 10001)";
        } else {
          isValid = true;
        }
        break;
    }

    return { isValid, isTouched: true, error };
  };

  const checkFormValidity = (
    info: CustomerInfo,
    address: ShippingAddress,
  ): void => {
    const requiredFields = ["email", "firstName", "lastName", "addressLine1", "city", "state", "zipCode"];
    const isValid = requiredFields.every((field) => {
      if (field === "email") return validateEmail(info.email);
      if (field === "firstName") return !!info.firstName.trim();
      if (field === "lastName") return !!info.lastName.trim();
      if (field === "addressLine1") return !!address.addressLine1.trim();
      if (field === "city") return !!address.city.trim();
      if (field === "state") return !!address.state;
      if (field === "zipCode") return validateZipCode(address.zipCode);
      return false;
    });
    onValidationChange(isValid);
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string): void => {
    const updated = { ...customerInfo, [field]: value };
    setCustomerInfo(updated);
    onCustomerInfoChange(updated);

    // Validate on change
    const validation = validateField(field, value);
    const newValidations = { ...fieldValidations, [field]: validation };
    setFieldValidations(newValidations);
    checkFormValidity(updated, shippingAddress);
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string): void => {
    const updated = { ...shippingAddress, [field]: value };
    setShippingAddress(updated);
    onShippingAddressChange(updated);

    // Clear saved address selection when manually editing
    setSelectedAddressId(null);

    // Validate on change
    const validation = validateField(field, value);
    const newValidations = { ...fieldValidations, [field]: validation };
    setFieldValidations(newValidations);
    checkFormValidity(customerInfo, updated);
  };

  const handleBlur = (field: string, value: string): void => {
    const validation = validateField(field, value);
    setFieldValidations((prev) => ({ ...prev, [field]: validation }));
  };

  const handleSavedAddressSelect = (address: SavedAddress | null): void => {
    if (address) {
      setSelectedAddressId(address.id);
      const newAddress: ShippingAddress = {
        addressLine1: address.address_line1,
        addressLine2: address.address_line2 || "",
        city: address.city,
        state: address.state,
        zipCode: address.zip_code,
        country: address.country,
      };
      setShippingAddress(newAddress);
      onShippingAddressChange(newAddress);

      // Also update customer info name from address
      const updatedInfo = {
        ...customerInfo,
        firstName: address.first_name,
        lastName: address.last_name,
      };
      setCustomerInfo(updatedInfo);
      onCustomerInfoChange(updatedInfo);

      // Mark all address fields as valid
      setFieldValidations((prev) => ({
        ...prev,
        firstName: { isValid: true, isTouched: true, error: "" },
        lastName: { isValid: true, isTouched: true, error: "" },
        addressLine1: { isValid: true, isTouched: true, error: "" },
        city: { isValid: true, isTouched: true, error: "" },
        state: { isValid: true, isTouched: true, error: "" },
        zipCode: { isValid: true, isTouched: true, error: "" },
      }));
      checkFormValidity(updatedInfo, newAddress);
    } else {
      setSelectedAddressId(null);
      // Clear the form for new address entry
      const emptyAddress: ShippingAddress = {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      };
      setShippingAddress(emptyAddress);
      onShippingAddressChange(emptyAddress);

      // Reset address field validations
      setFieldValidations((prev) => ({
        ...prev,
        addressLine1: { isValid: false, isTouched: false, error: "" },
        city: { isValid: false, isTouched: false, error: "" },
        state: { isValid: false, isTouched: false, error: "" },
        zipCode: { isValid: false, isTouched: false, error: "" },
      }));
      checkFormValidity(customerInfo, emptyAddress);
    }
  };

  const handleSaveAddressToggle = (checked: boolean): void => {
    setSaveAddress(checked);
    onSaveAddressChange?.(checked);
  };

  const getInputClassName = (field: string): string => {
    const validation = fieldValidations[field];
    return cn(
      "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
      "min-h-[44px]", // 44px minimum touch target
      validation?.isTouched && validation?.error && "border-error",
      validation?.isTouched && validation?.isValid && "border-success",
      !validation?.isTouched && "border-border"
    );
  };

  const renderValidationIcon = (field: string): React.JSX.Element | null => {
    const validation = fieldValidations[field];
    if (validation?.isTouched && validation?.isValid) {
      return (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Check className="w-4 h-4 text-success" />
        </div>
      );
    }
    return null;
  };

  // Determine if we should show the manual form (no saved address selected or user clicked "new address")
  const showManualForm = !selectedAddressId;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                inputMode="email"
                autoComplete="email"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={getInputClassName("email")}
                placeholder="you@example.com"
              />
              {renderValidationIcon("email")}
            </div>
            {fieldValidations.email?.isTouched && fieldValidations.email?.error && (
              <p className="mt-1 text-sm text-error">{fieldValidations.email.error}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  autoComplete="given-name"
                  value={customerInfo.firstName}
                  onChange={(e) => handleCustomerInfoChange("firstName", e.target.value)}
                  onBlur={(e) => handleBlur("firstName", e.target.value)}
                  className={getInputClassName("firstName")}
                  placeholder="John"
                />
                {renderValidationIcon("firstName")}
              </div>
              {fieldValidations.firstName?.isTouched && fieldValidations.firstName?.error && (
                <p className="mt-1 text-sm text-error">{fieldValidations.firstName.error}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  autoComplete="family-name"
                  value={customerInfo.lastName}
                  onChange={(e) => handleCustomerInfoChange("lastName", e.target.value)}
                  onBlur={(e) => handleBlur("lastName", e.target.value)}
                  className={getInputClassName("lastName")}
                  placeholder="Doe"
                />
                {renderValidationIcon("lastName")}
              </div>
              {fieldValidations.lastName?.isTouched && fieldValidations.lastName?.error && (
                <p className="mt-1 text-sm text-error">{fieldValidations.lastName.error}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              inputMode="tel"
              autoComplete="tel"
              value={customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
              className={cn(
                "w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                "min-h-[44px]"
              )}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>

        {/* Saved Address Selector for authenticated users */}
        {isAuthenticated && (
          <SavedAddressSelector
            onSelect={handleSavedAddressSelect}
            selectedAddressId={selectedAddressId}
          />
        )}

        {/* Manual Address Form */}
        {showManualForm && (
          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium mb-1">
                Street Address <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="addressLine1"
                  autoComplete="address-line1"
                  value={shippingAddress.addressLine1}
                  onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
                  onBlur={(e) => handleBlur("addressLine1", e.target.value)}
                  className={getInputClassName("addressLine1")}
                  placeholder="123 Main St"
                />
                {renderValidationIcon("addressLine1")}
              </div>
              {fieldValidations.addressLine1?.isTouched && fieldValidations.addressLine1?.error && (
                <p className="mt-1 text-sm text-error">{fieldValidations.addressLine1.error}</p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium mb-1">
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                id="addressLine2"
                autoComplete="address-line2"
                value={shippingAddress.addressLine2}
                onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
                className={cn(
                  "w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                  "min-h-[44px]"
                )}
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  City <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="city"
                    autoComplete="address-level2"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    onBlur={(e) => handleBlur("city", e.target.value)}
                    className={getInputClassName("city")}
                    placeholder="New York"
                  />
                  {renderValidationIcon("city")}
                </div>
                {fieldValidations.city?.isTouched && fieldValidations.city?.error && (
                  <p className="mt-1 text-sm text-error">{fieldValidations.city.error}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-1">
                  State <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    id="state"
                    autoComplete="address-level1"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    onBlur={(e) => handleBlur("state", e.target.value)}
                    className={cn(
                      getInputClassName("state"),
                      "appearance-none bg-background"
                    )}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {fieldValidations.state?.isTouched && fieldValidations.state?.isValid && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                  )}
                </div>
                {fieldValidations.state?.isTouched && fieldValidations.state?.error && (
                  <p className="mt-1 text-sm text-error">{fieldValidations.state.error}</p>
                )}
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                  ZIP Code <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="zipCode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                    onBlur={(e) => handleBlur("zipCode", e.target.value)}
                    className={getInputClassName("zipCode")}
                    placeholder="10001"
                  />
                  {renderValidationIcon("zipCode")}
                </div>
                {fieldValidations.zipCode?.isTouched && fieldValidations.zipCode?.error && (
                  <p className="mt-1 text-sm text-error">{fieldValidations.zipCode.error}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                Country
              </label>
              <select
                id="country"
                autoComplete="country"
                value={shippingAddress.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                className={cn(
                  "w-full px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                  "min-h-[44px] appearance-none bg-background"
                )}
              >
                <option value="US">United States</option>
              </select>
            </div>

            {/* Save Address Checkbox for authenticated users entering new address */}
            {isAuthenticated && (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => handleSaveAddressToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border border-border rounded transition-colors peer-checked:bg-primary peer-checked:border-primary group-hover:border-primary/50">
                    {saveAddress && (
                      <Check className="w-full h-full text-primary-foreground p-0.5" />
                    )}
                  </div>
                </div>
                <span className="text-sm">Save this address for future orders</span>
              </label>
            )}
          </div>
        )}

        {/* Show selected address summary when a saved address is selected */}
        {selectedAddressId && !showManualForm && (
          <div className="mt-4 p-4 bg-background-secondary rounded-lg">
            <p className="text-sm font-medium">
              {shippingAddress.addressLine1}
              {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
            </p>
            <p className="text-sm text-muted">
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
