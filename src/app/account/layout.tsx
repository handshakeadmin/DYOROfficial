"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const navigation = [
  { name: "Account", href: "/account", icon: User },
  { name: "Orders", href: "/account/orders", icon: Package },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
];

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-[calc(100vh-300px)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                  {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {profile?.first_name
                      ? `${profile.first_name} ${profile.last_name || ""}`.trim()
                      : "Welcome"}
                  </p>
                  <p className="text-sm text-muted truncate">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-background-secondary"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Sign Out */}
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
