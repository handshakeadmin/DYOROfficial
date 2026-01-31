"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Mail, Phone, Loader2, Check, AlertCircle, Package, Heart, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";

interface AccountStats {
  orderCount: number;
  totalSpent: number;
}

export default function AccountPage(): React.JSX.Element {
  const { profile, updateProfile, isLoading: authLoading } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AccountStats>({ orderCount: 0, totalSpent: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  // Fetch order stats
  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const response = await fetch("/api/orders?limit=100");
        if (response.ok) {
          const data = await response.json();
          const orders = data.orders || [];
          const totalSpent = orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);
          setStats({
            orderCount: data.pagination?.total || orders.length,
            totalSpent,
          });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="bg-card rounded-md border border-border p-6 text-center hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="w-5 h-5 text-primary" />
          </div>
          {statsLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          ) : (
            <p className="text-3xl font-bold text-primary">{stats.orderCount}</p>
          )}
          <p className="text-sm text-muted mt-1 group-hover:text-foreground transition-colors">
            Orders Placed
          </p>
        </Link>

        <Link
          href="/wishlist"
          className="bg-card rounded-md border border-border p-6 text-center hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{wishlistItems.length}</p>
          <p className="text-sm text-muted mt-1 group-hover:text-foreground transition-colors">
            Wishlist Items
          </p>
        </Link>

        <div className="bg-card rounded-md border border-border p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          {statsLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
          ) : (
            <p className="text-3xl font-bold text-primary">{formatPrice(stats.totalSpent)}</p>
          )}
          <p className="text-sm text-muted mt-1">Total Spent</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card rounded-md border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-error/10 border border-error/20 text-error rounded p-4 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-success/10 border border-success/20 text-success rounded p-4 text-sm">
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
                className="w-full px-3 py-2 rounded border border-border bg-background focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3 py-2 rounded border border-border bg-background focus:outline-none focus:border-primary transition-colors"
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
                className="w-full pl-12 pr-4 py-2 rounded border border-border bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2.5 rounded font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="bg-card rounded-md border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Email Address
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background-secondary rounded">
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

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="bg-card rounded-md border border-border p-4 hover:border-primary/50 transition-colors flex items-center gap-3"
        >
          <Package className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Order History</p>
            <p className="text-sm text-muted">View and track your orders</p>
          </div>
        </Link>

        <Link
          href="/orders/track"
          className="bg-card rounded-md border border-border p-4 hover:border-primary/50 transition-colors flex items-center gap-3"
        >
          <Package className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Track Guest Order</p>
            <p className="text-sm text-muted">Find orders placed without account</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
