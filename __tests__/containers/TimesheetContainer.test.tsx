import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import timesheetReducer from "@/store/slices/timesheetSlice";
import { TimesheetContainer } from "@/containers/timesheet/TimesheetContainer";
import { Timesheet } from "@/types/timesheet";

// Mock timesheetService
jest.mock("@/services/timesheetService", () => ({
  fetchTimesheets: jest.fn(),
  createTimesheet: jest.fn(),
  updateTimesheet: jest.fn(),
  deleteTimesheet: jest.fn(),
}));

import {
  fetchTimesheets,
  createTimesheet,
} from "@/services/timesheetService";

const mockFetch = fetchTimesheets as jest.MockedFunction<typeof fetchTimesheets>;
const _mockCreate = createTimesheet as jest.MockedFunction<typeof createTimesheet>;

// A "submitted" timesheet → displays as COMPLETED with "View" action
const mockTimesheets: Timesheet[] = [
  {
    id: "ts_001",
    weekNumber: 32,
    date: "2026-08-03",
    status: "submitted",
    createdAt: "2026-08-03T00:00:00.000Z",
    updatedAt: "2026-08-03T00:00:00.000Z",
  },
];

// A "draft" timesheet → displays as INCOMPLETE with "Update" action
const mockDraftTimesheets: Timesheet[] = [
  {
    id: "ts_002",
    weekNumber: 31,
    date: "2026-07-27",
    status: "draft",
    createdAt: "2026-07-27T00:00:00.000Z",
    updatedAt: "2026-07-27T00:00:00.000Z",
  },
];

function createTestStore() {
  return configureStore({
    reducer: { auth: authReducer, timesheet: timesheetReducer },
  });
}

function renderWithStore(component: React.ReactElement) {
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
}

describe("TimesheetContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading skeleton while fetching", () => {
    // Never resolves during this test
    mockFetch.mockReturnValue(new Promise(() => {}));
    renderWithStore(<TimesheetContainer />);
    expect(
      screen.getByRole("status", { name: /loading timesheets/i })
    ).toBeInTheDocument();
  });

  it("renders timesheets after successful fetch", async () => {
    mockFetch.mockResolvedValueOnce(mockTimesheets);
    renderWithStore(<TimesheetContainer />);

    // Week number is shown as plain number, not "Week 32"
    expect(await screen.findByText("32")).toBeInTheDocument();
    // submitted → COMPLETED badge
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });

  it("shows empty state when no timesheets returned", async () => {
    mockFetch.mockResolvedValueOnce([]);
    renderWithStore(<TimesheetContainer />);

    expect(
      await screen.findByText(/no timesheets match/i)
    ).toBeInTheDocument();
  });

  it("shows error message when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    renderWithStore(<TimesheetContainer />);

    expect(
      await screen.findByText(/network error/i)
    ).toBeInTheDocument();
  });

  it("opens modal when Add Timesheet button is clicked", async () => {
    mockFetch.mockResolvedValueOnce(mockTimesheets);
    const user = userEvent.setup();
    renderWithStore(<TimesheetContainer />);

    // Wait for data to load
    await screen.findByText("32");
    await user.click(screen.getByRole("button", { name: /add timesheet/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/new timesheet/i)).toBeInTheDocument();
  });

  it("opens edit modal when action link is clicked on a draft timesheet", async () => {
    // draft → "Update" action link
    mockFetch.mockResolvedValueOnce(mockDraftTimesheets);
    const user = userEvent.setup();
    renderWithStore(<TimesheetContainer />);

    await screen.findByText("31");
    await user.click(
      screen.getByRole("button", { name: /update week 31 timesheet/i })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/edit timesheet/i)).toBeInTheDocument();
  });
});
