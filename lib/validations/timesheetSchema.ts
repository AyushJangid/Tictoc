import { z } from "zod";
import { TIMESHEET_STATUSES, MIN_WEEK_NUMBER, MAX_WEEK_NUMBER } from "@/constants";
import { TimesheetStatus } from "@/types/timesheet";

// Cast the array to the tuple type Zod requires for z.enum()
const STATUS_TUPLE = TIMESHEET_STATUSES as unknown as [
  TimesheetStatus,
  ...TimesheetStatus[]
];

export const timesheetFormSchema = z.object({
  weekNumber: z
    .number({
      required_error: "Week number is required",
      invalid_type_error: "Week number must be a number",
    })
    .int("Week number must be a whole number")
    .min(
      MIN_WEEK_NUMBER,
      `Week number must be between ${MIN_WEEK_NUMBER} and ${MAX_WEEK_NUMBER}`
    )
    .max(
      MAX_WEEK_NUMBER,
      `Week number must be between ${MIN_WEEK_NUMBER} and ${MAX_WEEK_NUMBER}`
    ),

  date: z
    .string({
      required_error: "Date is required",
    })
    .min(1, "Date is required")
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, "Please enter a valid date"),

  status: z.enum(STATUS_TUPLE, {
    required_error: "Status is required",
    invalid_type_error: "Please select a valid status",
  }),
});

export type TimesheetFormSchema = z.infer<typeof timesheetFormSchema>;
