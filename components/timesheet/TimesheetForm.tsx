"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { TIMESHEET_STATUSES, TIMESHEET_DISPLAY_CONFIG } from "@/constants";
import { TimesheetFormSchema } from "@/lib/validations/timesheetSchema";

interface TimesheetFormProps {
  register: UseFormRegister<TimesheetFormSchema>;
  errors: FieldErrors<TimesheetFormSchema>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TimesheetForm({
  register,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditing = false,
}: TimesheetFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-5">
        {/* Week Number */}
        <Input
          label="Week Number"
          type="number"
          id="weekNumber"
          required
          min={1}
          max={53}
          placeholder="e.g. 32"
          error={errors.weekNumber?.message}
          {...register("weekNumber", { valueAsNumber: true })}
        />

        {/* Date */}
        <Input
          label="Week Start Date"
          type="date"
          id="date"
          required
          error={errors.date?.message}
          {...register("date")}
        />

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700"
          >
            Status
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id="status"
            aria-describedby={errors.status ? "status-error" : undefined}
            aria-invalid={errors.status ? "true" : undefined}
            className={[
              "w-full rounded-lg border px-3 py-2 text-sm text-gray-900",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
              errors.status
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400",
            ].join(" ")}
            {...register("status")}
          >
            <option value="">Select a status...</option>
            {TIMESHEET_STATUSES.map((s) => (
              <option key={s} value={s}>
                {TIMESHEET_DISPLAY_CONFIG[s].label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p id="status-error" role="alert" className="text-xs text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Timesheet"}
          </Button>
        </div>
      </div>
    </form>
  );
}
