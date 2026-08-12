import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { timesheetsStore } from "@/lib/mockData";
import { timesheetFormSchema } from "@/lib/validations/timesheetSchema";
import { Timesheet } from "@/types/timesheet";

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const index = timesheetsStore.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
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

  const existing = timesheetsStore[index];
  const updated: Timesheet = {
    id: existing.id,
    createdAt: existing.createdAt,
    weekNumber: parsed.data.weekNumber,
    date: parsed.data.date,
    status: parsed.data.status,
    updatedAt: new Date().toISOString(),
  };

  timesheetsStore[index] = updated;

  return NextResponse.json({ data: updated }, { status: 200 });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const index = timesheetsStore.findIndex((t) => t.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
  }

  timesheetsStore.splice(index, 1);

  return NextResponse.json({ data: { id } }, { status: 200 });
}
