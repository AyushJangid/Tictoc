import { Timesheet } from "@/types/timesheet";
import { TIMESHEET_DISPLAY_CONFIG } from "@/constants";
import { StatusBadge } from "./StatusBadge";

interface TimesheetRowProps {
  timesheet: Timesheet;
  onAction: (timesheet: Timesheet) => void;
}

function formatWeekRange(dateStr: string): string {
  const start = new Date(dateStr + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = start.getFullYear();
  const startMonth = start.toLocaleDateString("en-GB", { month: "long" });
  const endMonth = end.toLocaleDateString("en-GB", { month: "long" });

  return start.getMonth() === end.getMonth()
    ? `${startDay} - ${endDay} ${startMonth}, ${year}`
    : `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${year}`;
}

export function TimesheetRow({ timesheet, onAction }: TimesheetRowProps) {
  const { actionLabel } = TIMESHEET_DISPLAY_CONFIG[timesheet.status];

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-75">
      <td className="px-4 py-4 text-sm text-gray-700 w-24">
        {timesheet.weekNumber}
      </td>

      <td className="px-4 py-4 text-sm text-gray-600">
        {formatWeekRange(timesheet.date)}
      </td>

      <td className="px-4 py-4 w-40">
        <StatusBadge status={timesheet.status} />
      </td>

      <td className="px-4 py-4 text-right w-28">
        <button
          onClick={() => onAction(timesheet)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          aria-label={`${actionLabel} week ${timesheet.weekNumber} timesheet`}
        >
          {actionLabel}
        </button>
      </td>
    </tr>
  );
}
