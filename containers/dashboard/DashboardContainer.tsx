"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/store";
import { clearUser } from "@/store/slices/authSlice";
import { signOutUser } from "@/services/authService";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TimesheetContainer } from "@/containers/timesheet/TimesheetContainer";

export function DashboardContainer() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    dispatch(clearUser());
    await signOutUser();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader
        userEmail={session?.user?.email}
        userName={session?.user?.name}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <TimesheetContainer />
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} ticktock. All rights reserved.
      </footer>
    </div>
  );
}
