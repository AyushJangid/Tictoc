import type { Metadata } from "next";
import { LoginContainer } from "@/containers/auth/LoginContainer";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Sign in — ${APP_NAME}`,
  description: "Sign in to your TicToc account to manage your timesheets.",
};

export default function LoginPage() {
  return <LoginContainer />;
}
