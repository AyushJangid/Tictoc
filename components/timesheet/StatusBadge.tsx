import { TimesheetStatus } from "@/types/timesheet";
import { TIMESHEET_DISPLAY_CONFIG } from "@/constants";

interface StatusBadgeProps {
  status: TimesheetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, badgeClass } = TIMESHEET_DISPLAY_CONFIG[status];

  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold tracking-wide",
        badgeClass,
      ].join(" ")}
    >
      {label}
    </span>
  );
}
