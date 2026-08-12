"use client";

import { Modal } from "@/components/common/Modal";
import { TimesheetForm } from "./TimesheetForm";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TimesheetFormSchema } from "@/lib/validations/timesheetSchema";

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  register: UseFormRegister<TimesheetFormSchema>;
  errors: FieldErrors<TimesheetFormSchema>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function TimesheetModal({
  isOpen,
  onClose,
  isEditing,
  register,
  errors,
  isSubmitting,
  onSubmit,
}: TimesheetModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Timesheet" : "New Timesheet"}
    >
      <TimesheetForm
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={onClose}
        isEditing={isEditing}
      />
    </Modal>
  );
}
