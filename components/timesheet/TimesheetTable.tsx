import { Timesheet } from "@/types/timesheet";
import { TimesheetRow } from "./TimesheetRow";
import { Pagination } from "@/components/common/Pagination";

type SortColumn = "weekNumber" | "date" | "status";
type SortDir = "asc" | "desc";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

interface TimesheetTableProps {
  timesheets: Timesheet[];
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (col: SortColumn) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (n: number) => void;
  onAction: (timesheet: Timesheet) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={[
        "ml-1 inline-block transition-opacity",
        active ? "opacity-100 text-gray-700" : "opacity-40",
      ].join(" ")}
      aria-hidden="true"
    >
      {dir === "desc" || !active ? "↓" : "↑"}
    </span>
  );
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Status" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "draft", label: "Draft" },
  { value: "rejected", label: "Rejected" },
];

export function TimesheetTable({
  timesheets,
  sortColumn,
  sortDir,
  onSort,
  statusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onAction,
}: TimesheetTableProps) {
  const selectBase =
    "appearance-none border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative">
          <select className={selectBase} defaultValue="all" aria-label="Filter by date range">
            <option value="all">Date Range</option>
            <option value="thisYear">This Year</option>
            <option value="lastQuarter">Last 3 Months</option>
            <option value="lastMonth">Last Month</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ▾
          </span>
        </div>

        <div className="relative">
          <select
            className={selectBase}
            value={statusFilter}
            onChange={(e) => {
              onStatusFilterChange(e.target.value);
              onPageChange(1);
            }}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ▾
          </span>
        </div>
      </div>

      {timesheets.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">
          No timesheets match the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="border-b border-gray-200">
                {(
                  [
                    { col: "weekNumber" as SortColumn, label: "WEEK #" },
                    { col: "date" as SortColumn, label: "DATE" },
                    { col: "status" as SortColumn, label: "STATUS" },
                  ] as const
                ).map(({ col, label }) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-4 py-3 text-left"
                  >
                    <button
                      className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => onSort(col)}
                      aria-label={`Sort by ${label}`}
                    >
                      {label}
                      <SortIcon
                        active={sortColumn === col}
                        dir={sortColumn === col ? sortDir : "desc"}
                      />
                    </button>
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => (
                <TimesheetRow key={ts.id} timesheet={ts} onAction={onAction} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalItems > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <div className="relative">
            <select
              className={selectBase}
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              aria-label="Items per page"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▾
            </span>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
