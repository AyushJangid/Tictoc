import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timesheet, TimesheetState } from "@/types/timesheet";

const initialState: TimesheetState = {
  timesheets: [],
  selectedTimesheet: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

const timesheetSlice = createSlice({
  name: "timesheet",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
      state.isSubmitting = false;
    },
    clearError(state) {
      state.error = null;
    },
    setTimesheets(state, action: PayloadAction<Timesheet[]>) {
      state.timesheets = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addTimesheet(state, action: PayloadAction<Timesheet>) {
      state.timesheets.unshift(action.payload);
      state.isSubmitting = false;
    },
    updateTimesheet(state, action: PayloadAction<Timesheet>) {
      const index = state.timesheets.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.timesheets[index] = action.payload;
      }
      state.isSubmitting = false;
    },
    removeTimesheet(state, action: PayloadAction<string>) {
      state.timesheets = state.timesheets.filter(
        (t) => t.id !== action.payload
      );
    },
    setSelectedTimesheet(state, action: PayloadAction<Timesheet | null>) {
      state.selectedTimesheet = action.payload;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setError,
  clearError,
  setTimesheets,
  addTimesheet,
  updateTimesheet,
  removeTimesheet,
  setSelectedTimesheet,
} = timesheetSlice.actions;

export default timesheetSlice.reducer;
