"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setLoading,
  setTimesheets,
  addTimesheet,
  updateTimesheet,
  setSelectedTimesheet,
  setError,
  setSubmitting,
  clearError,
} from "@/store/slices/timesheetSlice";
import {
  fetchTimesheets,
  createTimesheet,
  updateTimesheet as updateTimesheetService,
} from "@/services/timesheetService";
import {
  timesheetFormSchema,
  TimesheetFormSchema,
} from "@/lib/validations/timesheetSchema";
import { Timesheet, TimesheetStatus } from "@/types/timesheet";
import { TimesheetTable } from "@/components/timesheet/TimesheetTable";
import { TimesheetModal } from "@/components/timesheet/TimesheetModal";
import { TableSkeleton } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Button } from "@/components/common/Button";

type SortColumn = "weekNumber" | "date" | "status";
type SortDir = "asc" | "desc";

export function TimesheetContainer() {
  const dispatch = useAppDispatch();
  const { timesheets, isLoading, isSubmitting, error, selectedTimesheet } =
    useAppSelector((state) => state.timesheet);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");

  const [sortColumn, setSortColumn] = useState<SortColumn>("weekNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<TimesheetFormSchema>({
      resolver: zodResolver(timesheetFormSchema),
      defaultValues: { weekNumber: undefined, date: "", status: undefined },
    });

  const loadTimesheets = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const data = await fetchTimesheets();
      dispatch(setTimesheets(data));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load timesheets";
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadTimesheets();
  }, [loadTimesheets]);

  const processedTimesheets = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? timesheets
        : timesheets.filter((t) => t.status === (statusFilter as TimesheetStatus));

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortColumn === "weekNumber") cmp = a.weekNumber - b.weekNumber;
      else if (sortColumn === "date") cmp = a.date.localeCompare(b.date);
      else if (sortColumn === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [timesheets, statusFilter, sortColumn, sortDir]);

  const totalItems = processedTimesheets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedTimesheets = processedTimesheets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (col: SortColumn) => {
    if (col === sortColumn) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDir("desc");
    }
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    dispatch(setSelectedTimesheet(null));
    reset({ weekNumber: undefined, date: "", status: undefined });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (timesheet: Timesheet) => {
    dispatch(setSelectedTimesheet(timesheet));
    reset({
      weekNumber: timesheet.weekNumber,
      date: timesheet.date,
      status: timesheet.status,
    });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      dispatch(setSelectedTimesheet(null));
      reset();
    }
  };

  const onSubmit = async (data: TimesheetFormSchema) => {
    dispatch(setSubmitting(true));
    setSubmitError(null);
    try {
      if (selectedTimesheet) {
        const updated = await updateTimesheetService(selectedTimesheet.id, data);
        dispatch(updateTimesheet(updated));
      } else {
        const created = await createTimesheet(data);
        dispatch(addTimesheet(created));
      }
      setIsModalOpen(false);
      dispatch(setSelectedTimesheet(null));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save timesheet";
      setSubmitError(msg);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const isEditing = !!selectedTimesheet;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Your Timesheets</h1>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          + Add Timesheet
        </Button>
      </div>

      {submitError && (
        <div
          role="alert"
          className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      {isLoading ? (
        <TableSkeleton rows={itemsPerPage} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadTimesheets} />
      ) : (
        <TimesheetTable
          timesheets={paginatedTimesheets}
          sortColumn={sortColumn}
          sortDir={sortDir}
          onSort={handleSort}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setCurrentPage(1);
          }}
          onAction={handleOpenEdit}
        />
      )}

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isEditing={isEditing}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
