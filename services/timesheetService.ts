import { API_ROUTES } from "@/constants";
import { Timesheet, TimesheetFormValues, ApiResponse } from "@/types/timesheet";

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error ?? `Request failed with status ${response.status}`);
  }

  return json.data as T;
}

export async function fetchTimesheets(): Promise<Timesheet[]> {
  const response = await fetch(API_ROUTES.TIMESHEETS, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return handleResponse<Timesheet[]>(response);
}

export async function createTimesheet(
  values: TimesheetFormValues
): Promise<Timesheet> {
  const response = await fetch(API_ROUTES.TIMESHEETS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return handleResponse<Timesheet>(response);
}

export async function updateTimesheet(
  id: string,
  values: TimesheetFormValues
): Promise<Timesheet> {
  const response = await fetch(API_ROUTES.TIMESHEET_BY_ID(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return handleResponse<Timesheet>(response);
}

export async function deleteTimesheet(id: string): Promise<void> {
  const response = await fetch(API_ROUTES.TIMESHEET_BY_ID(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  await handleResponse<ApiResponse<{ id: string }>>(response);
}
