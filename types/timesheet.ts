export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

export interface Timesheet {
  id: string;
  weekNumber: number;
  date: string; // ISO date string: YYYY-MM-DD
  status: TimesheetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TimesheetFormValues {
  weekNumber: number;
  date: string;
  status: TimesheetStatus;
}

export interface TimesheetState {
  timesheets: Timesheet[];
  selectedTimesheet: Timesheet | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
