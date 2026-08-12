import { TimesheetStatus } from "@/types/timesheet";

export const DUMMY_CREDENTIALS = {
  email: "admin@tictoc.com",
  password: "Admin@123",
  userId: "usr_001",
  name: "Admin User",
} as const;

export const APP_NAME = "TicToc" as const;
export const APP_TAGLINE = "Timesheet Management" as const;

export const API_ROUTES = {
  TIMESHEETS: "/api/timesheets",
  TIMESHEET_BY_ID: (id: string) => `/api/timesheets/${id}`,
} as const;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;

export const TIMESHEET_DISPLAY_CONFIG: Record<
  TimesheetStatus,
  { label: string; badgeClass: string; actionLabel: string }
> = {
  submitted: {
    label: "COMPLETED",
    badgeClass: "bg-emerald-100 text-emerald-700",
    actionLabel: "View",
  },
  approved: {
    label: "COMPLETED",
    badgeClass: "bg-emerald-100 text-emerald-700",
    actionLabel: "View",
  },
  draft: {
    label: "INCOMPLETE",
    badgeClass: "bg-amber-100 text-amber-700",
    actionLabel: "Update",
  },
  rejected: {
    label: "MISSING",
    badgeClass: "bg-rose-100 text-rose-500",
    actionLabel: "Create",
  },
} as const;

export const TIMESHEET_STATUSES: TimesheetStatus[] = [
  "draft",
  "submitted",
  "approved",
  "rejected",
];

export const MIN_WEEK_NUMBER = 1;
export const MAX_WEEK_NUMBER = 53;
