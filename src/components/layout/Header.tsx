"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
  Shield,
  FlaskConical,
  FileCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Shop All Peptides",
    href: "/products",
  },
  {
    name: "Capsules",
    href: "/products?type=capsules",
  },
  {
    name: "Nasal Sprays",
    href: "/products?type=nasal-spray",
  },
  {
    name: "Serums",
    href: "/products?type=serum",
  },
];

export function Header(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, profile, signOut, isLoading: authLoading } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        {/* Trust Indicator Bar */}
        <div className="bg-primary text-primary-foreground py-1.5 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              GMP Certified
            </span>
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-accent" />
              99%+ Purity
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-accent" />
              Third-Party Tested
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-accent" />
              Free Shipping $150+
            </span>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-accent text-accent-foreground py-2 text-center text-sm font-medium">
          <p>
            Use Code <span className="font-bold">RESEARCH20</span> for 20% OFF Your First Order
          </p>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">Peptide</span>
                <span className="text-2xl font-bold text-accent">Source</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/about"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <button
                type="button"
                className="p-2 text-foreground hover:text-accent transition-colors"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-foreground hover:text-accent transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>

              {/* Account */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 p-2 text-foreground hover:text-accent transition-colors"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    >
                      <div className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                        {profile?.first_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <ChevronDown className={cn("h-4 w-4 hidden sm:block transition-transform", userMenuOpen && "rotate-180")} />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20 py-2">
                          <div className="px-4 py-2 border-b border-border">
                            <p className="text-sm font-medium text-foreground truncate">
                              {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}`.trim() : "Welcome"}
                            </p>
                            <p className="text-xs text-muted truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-background-secondary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-background-secondary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Package className="w-4 h-4" />
                            Orders
                          </Link>
                          <Link
                            href="/account/addresses"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-background-secondary transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <MapPin className="w-4 h-4" />
                            Addresses
                          </Link>
                          <div className="border-t border-border mt-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                signOut();
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-background-secondary transition-colors w-full"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 text-foreground hover:text-accent transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <button
                type="button"
                className="relative p-2 text-foreground hover:text-accent transition-colors"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 bg-background-secondary",
            searchOpen ? "max-h-20 py-4" : "max-h-0"
          )}
        >
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="text"
                placeholder="Search for peptides..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-primary">Peptide</span>
              <span className="text-xl font-bold text-accent">Source</span>
            </Link>
            <button
              type="button"
              className="p-2 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 px-4 text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="block py-3 px-4 text-foreground hover:bg-background-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-3 px-4 text-foreground hover:bg-background-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="block py-3 px-4 text-foreground hover:bg-background-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-foreground">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}`.trim() : "Welcome"}
                  </p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
                <Link
                  href="/account"
                  className="flex items-center gap-3 py-2 px-4 text-foreground hover:bg-background-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>My Account</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 px-4 text-error hover:bg-background-secondary rounded-lg transition-colors w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-border text-foreground rounded-lg font-medium hover:bg-background-secondary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
