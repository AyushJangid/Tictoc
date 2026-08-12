import { Timesheet, TimesheetStatus } from "@/types/timesheet";

function ts(
  id: string,
  weekNumber: number,
  date: string,
  status: TimesheetStatus
): Timesheet {
  return {
    id,
    weekNumber,
    date,
    status,
    createdAt: new Date(date).toISOString(),
    updatedAt: new Date(date).toISOString(),
  };
}

export const timesheetsStore: Timesheet[] = [
  ts("ts_001", 32, "2026-08-03", "submitted"),
  ts("ts_002", 31, "2026-07-27", "approved"),
  ts("ts_003", 30, "2026-07-20", "approved"),
  ts("ts_004", 29, "2026-07-13", "approved"),
  ts("ts_005", 28, "2026-07-06", "rejected"),
  ts("ts_006", 27, "2026-06-29", "approved"),
  ts("ts_007", 26, "2026-06-22", "approved"),
  ts("ts_008", 25, "2026-06-15", "approved"),
  ts("ts_009", 24, "2026-06-08", "draft"),
  ts("ts_010", 23, "2026-06-01", "submitted"),
  ts("ts_011", 22, "2026-05-25", "approved"),
  ts("ts_012", 21, "2026-05-18", "approved"),
  ts("ts_013", 20, "2026-05-11", "rejected"),
  ts("ts_014", 19, "2026-05-04", "draft"),
  ts("ts_015", 18, "2026-04-27", "approved"),
  ts("ts_016", 17, "2026-04-20", "approved"),
  ts("ts_017", 16, "2026-04-13", "rejected"),
  ts("ts_018", 15, "2026-04-06", "approved"),
  ts("ts_019", 14, "2026-03-30", "approved"),
  ts("ts_020", 13, "2026-03-23", "draft"),
  ts("ts_021", 12, "2026-03-16", "approved"),
  ts("ts_022", 11, "2026-03-09", "approved"),
  ts("ts_023", 10, "2026-03-02", "approved"),
  ts("ts_024",  9, "2026-02-23", "submitted"),
  ts("ts_025",  8, "2026-02-16", "approved"),
];

export function generateId(): string {
  return `ts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
