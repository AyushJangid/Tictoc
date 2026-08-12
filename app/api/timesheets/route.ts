import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { timesheetsStore, generateId } from "@/lib/mockData";
import { Timesheet, TimesheetFormValues } from "@/types/timesheet";
import { timesheetFormSchema } from "@/lib/validations/timesheetSchema";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sorted = [...timesheetsStore].sort(
    (a, b) => b.weekNumber - a.weekNumber
  );

  return NextResponse.json({ data: sorted }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = timesheetFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const values: TimesheetFormValues = parsed.data;

  const now = new Date().toISOString();
  const newTimesheet: Timesheet = {
    id: generateId(),
    weekNumber: values.weekNumber,
    date: values.date,
    status: values.status,
    createdAt: now,
    updatedAt: now,
  };

  timesheetsStore.push(newTimesheet);

  return NextResponse.json({ data: newTimesheet }, { status: 201 });
}
