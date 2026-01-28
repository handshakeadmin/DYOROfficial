"use client";

import { useState } from "react";
import { User, Mail, Phone, Loader2, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage(): React.JSX.Element {
  const { profile, updateProfile, isLoading: authLoading } = useAuth();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await updateProfile({
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Form */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-error/10 border border-error/20 text-error rounded-lg p-4 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent rounded-lg p-4 text-sm">
              <Check className="w-5 h-5 flex-shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-foreground"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-foreground"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-foreground"
            >
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Email Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Email Address
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
            <div>
              <p className="font-medium text-foreground">{profile?.email}</p>
              <p className="text-sm text-muted">Primary email address</p>
            </div>
            <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-medium">
              Verified
            </span>
          </div>
          <p className="text-sm text-muted">
            Contact support to change your email address.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-muted mt-1">Orders Placed</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-muted mt-1">Wishlist Items</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <p className="text-3xl font-bold text-primary">$0</p>
          <p className="text-sm text-muted mt-1">Total Spent</p>
        </div>
      </div>
    </div>
  );
}
