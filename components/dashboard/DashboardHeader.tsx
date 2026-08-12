"use client";

import { useState } from "react";
import { APP_NAME } from "@/constants";

interface DashboardHeaderProps {
  userEmail: string | null | undefined;
  userName: string | null | undefined;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function DashboardHeader({
  userEmail,
  userName,
  onLogout,
  isLoggingOut = false,
}: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const displayName = userName ?? userEmail ?? "John Doe";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-6 h-12 flex items-center">
        <span className="text-sm font-semibold text-gray-900 mr-4">
          {APP_NAME.toLowerCase()}
        </span>

        <span className="text-sm text-gray-400">Timesheets</span>

        <div className="flex-1" />

        <div className="relative">
          <button
            id="user-menu-button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <span>{displayName}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div
                role="menu"
                aria-labelledby="user-menu-button"
                className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  )}
                </div>
                <button
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
