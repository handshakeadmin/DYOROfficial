"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SavedAddressSelectorProps {
  onSelect: (address: SavedAddress | null) => void;
  selectedAddressId: string | null;
}

export function SavedAddressSelector({
  onSelect,
  selectedAddressId,
}: SavedAddressSelectorProps): React.JSX.Element | null {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useNewAddress, setUseNewAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async (): Promise<void> => {
      try {
        const response = await fetch("/api/addresses");
        if (response.ok) {
          const data = await response.json();
          setAddresses(data.addresses || []);

          // Auto-select default address if exists and nothing selected
          if (!selectedAddressId && data.addresses?.length > 0) {
            const defaultAddr = data.addresses.find((a: SavedAddress) => a.is_default);
            if (defaultAddr) {
              onSelect(defaultAddr);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [onSelect, selectedAddressId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading saved addresses...
      </div>
    );
  }

  if (addresses.length === 0) {
    return null;
  }

  const handleSelectAddress = (address: SavedAddress): void => {
    setUseNewAddress(false);
    onSelect(address);
  };

  const handleUseNewAddress = (): void => {
    setUseNewAddress(true);
    onSelect(null);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Saved Addresses
      </h3>

      <div className="space-y-2">
        {addresses.map((address) => (
          <button
            key={address.id}
            type="button"
            onClick={() => handleSelectAddress(address)}
            className={cn(
              "w-full text-left p-4 rounded-lg border transition-colors",
              selectedAddressId === address.id && !useNewAddress
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted mt-1">
                  {address.address_line1}
                  {address.address_line2 && `, ${address.address_line2}`}
                </p>
                <p className="text-sm text-muted">
                  {address.city}, {address.state} {address.zip_code}
                </p>
              </div>
              {selectedAddressId === address.id && !useNewAddress && (
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
          </button>
        ))}

        <button
          type="button"
          onClick={handleUseNewAddress}
          className={cn(
            "w-full text-left p-4 rounded-lg border transition-colors flex items-center gap-3",
            useNewAddress
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center">
            <Plus className="w-4 h-4 text-muted" />
          </div>
          <span className="text-sm font-medium">Use a new address</span>
          {useNewAddress && (
            <Check className="w-5 h-5 text-primary ml-auto" />
          )}
        </button>
      </div>
    </div>
  );
}
