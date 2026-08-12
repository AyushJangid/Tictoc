import type { Metadata } from "next";
import { DashboardContainer } from "@/containers/dashboard/DashboardContainer";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Dashboard — ${APP_NAME}`,
  description: "View and manage your weekly timesheets.",
};

export default function DashboardPage() {
  return <DashboardContainer />;
}
