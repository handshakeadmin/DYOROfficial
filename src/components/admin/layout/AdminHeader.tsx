"use client";

import { Bell, Search, User, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAdminAI } from "@/components/admin/ai";

interface AdminHeaderProps {
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps): React.ReactElement {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { toggleAssistant, isOpen: isAIOpen } = useAdminAI();

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2.5 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleAssistant}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              isAIOpen
                ? "text-emerald-600 bg-emerald-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
            aria-label="AI Assistant"
            title="AI Assistant"
          >
            <Sparkles className="h-5 w-5" />
          </button>

          <button
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {displayName}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <a
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
