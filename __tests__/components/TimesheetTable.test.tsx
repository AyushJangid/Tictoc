import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimesheetTable } from "@/components/timesheet/TimesheetTable";
import { Timesheet } from "@/types/timesheet";

const mockTimesheets: Timesheet[] = [
  {
    id: "ts_001",
    weekNumber: 32,
    date: "2026-08-03",
    status: "submitted",
    createdAt: "2026-08-03T00:00:00.000Z",
    updatedAt: "2026-08-03T00:00:00.000Z",
  },
  {
    id: "ts_002",
    weekNumber: 31,
    date: "2026-07-27",
    status: "draft",
    createdAt: "2026-07-27T00:00:00.000Z",
    updatedAt: "2026-07-27T00:00:00.000Z",
  },
];

// Helper that renders <TimesheetTable> with all required props pre-filled.
function renderTable(
  overrides: Partial<React.ComponentProps<typeof TimesheetTable>> = {}
) {
  const defaults: React.ComponentProps<typeof TimesheetTable> = {
    timesheets: mockTimesheets,
    sortColumn: "weekNumber",
    sortDir: "desc",
    onSort: jest.fn(),
    statusFilter: "all",
    onStatusFilterChange: jest.fn(),
    currentPage: 1,
    totalPages: 1,
    totalItems: mockTimesheets.length,
    itemsPerPage: 5,
    onPageChange: jest.fn(),
    onItemsPerPageChange: jest.fn(),
    onAction: jest.fn(),
  };
  return render(<TimesheetTable {...defaults} {...overrides} />);
}

describe("TimesheetTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table with column headers", () => {
    renderTable();

    expect(screen.getByRole('columnheader', { name: /week #/i })).toBeInTheDocument();
    // Use getAllByText because "date" appears in both the header and data rows
    expect(screen.getAllByText(/date/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/status/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();
  });

  it("renders all timesheet rows with week numbers", () => {
    renderTable();

    expect(screen.getByText("32")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
  });

  it("renders COMPLETED badge for submitted status", () => {
    renderTable();
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });

  it("renders INCOMPLETE badge for draft status", () => {
    renderTable();
    expect(screen.getByText("INCOMPLETE")).toBeInTheDocument();
  });

  it("calls onAction with the correct timesheet when action link is clicked", async () => {
    const mockOnAction = jest.fn();
    const user = userEvent.setup();
    renderTable({ onAction: mockOnAction });

    // First row is "submitted" → action label is "View"
    const viewButtons = screen.getAllByRole("button", { name: /view/i });
    await user.click(viewButtons[0]);

    expect(mockOnAction).toHaveBeenCalledTimes(1);
    expect(mockOnAction).toHaveBeenCalledWith(mockTimesheets[0]);
  });

  it("calls onAction with Update for draft timesheets", async () => {
    const mockOnAction = jest.fn();
    const user = userEvent.setup();
    renderTable({ onAction: mockOnAction });

    // Second row is "draft" → action label is "Update"
    const updateButton = screen.getByRole("button", { name: /update/i });
    await user.click(updateButton);

    expect(mockOnAction).toHaveBeenCalledWith(mockTimesheets[1]);
  });

  it("shows empty state when no timesheets are provided", () => {
    renderTable({ timesheets: [], totalItems: 0 });

    expect(
      screen.getByText(/no timesheets match/i)
    ).toBeInTheDocument();
  });

  it("renders date ranges in human-readable format", () => {
    renderTable();
    // Week 32 starts 2026-08-03 (Mon) and ends 2026-08-07 (Fri)
    expect(screen.getByText(/3 - 7 August, 2026/i)).toBeInTheDocument();
  });
});
