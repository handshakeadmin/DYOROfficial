"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  UserCircle,
  ExternalLink,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Customers",
    href: "/admin/users",
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Discount Codes",
    href: "/admin/discount-codes",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    label: "Affiliates",
    href: "/admin/affiliates",
    icon: <Users className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminSidebar(): React.ReactElement {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string): boolean => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "bg-gray-900 text-white flex flex-col transition-all duration-300 sticky top-0 h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <Link href="/admin" className="text-lg font-bold text-emerald-400">
            Admin Panel
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
              isActive(item.href)
                ? "bg-emerald-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-1">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
              isActive(item.href)
                ? "bg-emerald-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          title={collapsed ? "View Store" : undefined}
        >
          <ExternalLink className="h-5 w-5" />
          {!collapsed && <span>View Store</span>}
        </Link>
      </div>
    </aside>
  );
}
