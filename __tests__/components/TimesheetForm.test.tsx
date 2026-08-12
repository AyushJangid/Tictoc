import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimesheetForm } from "@/components/timesheet/TimesheetForm";
import { timesheetFormSchema, TimesheetFormSchema } from "@/lib/validations/timesheetSchema";

// Test harness component
function TimesheetFormWrapper({
  onSubmit = jest.fn(),
  onCancel = jest.fn(),
  isSubmitting = false,
  isEditing = false,
}: {
  onSubmit?: jest.Mock;
  onCancel?: jest.Mock;
  isSubmitting?: boolean;
  isEditing?: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<TimesheetFormSchema>({
    resolver: zodResolver(timesheetFormSchema),
  });

  return (
    <TimesheetForm
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={onCancel}
      isEditing={isEditing}
    />
  );
}

describe("TimesheetForm", () => {
  it("renders week number, date, and status fields", () => {
    render(<TimesheetFormWrapper />);

    expect(screen.getByLabelText(/week number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/week start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("shows 'Create Timesheet' submit button by default", () => {
    render(<TimesheetFormWrapper />);
    expect(
      screen.getByRole("button", { name: /create timesheet/i })
    ).toBeInTheDocument();
  });

  it("shows 'Save Changes' submit button when editing", () => {
    render(<TimesheetFormWrapper isEditing />);
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const mockCancel = jest.fn();
    render(<TimesheetFormWrapper onCancel={mockCancel} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors on submit with empty fields", async () => {
    const user = userEvent.setup();
    render(<TimesheetFormWrapper />);

    await user.click(screen.getByRole("button", { name: /create timesheet/i }));

    expect(
      await screen.findByText(/week number must be a number/i)
    ).toBeInTheDocument();
  });

  it("disables submit button while submitting", () => {
    render(<TimesheetFormWrapper isSubmitting />);
    expect(
      screen.getByRole("button", { name: /create timesheet/i })
    ).toBeDisabled();
  });
});
