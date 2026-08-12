import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { APP_ROUTES } from "@/constants";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResult {
  success: boolean;
  error?: string;
}

export async function signInWithCredentials(
  credentials: SignInCredentials
): Promise<SignInResult> {
  try {
    const result = await nextAuthSignIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    if (result?.ok) {
      return { success: true };
    }

    return { success: false, error: "An unexpected error occurred" };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signOutUser(): Promise<void> {
  await nextAuthSignOut({ redirect: false });
  if (typeof window !== "undefined") {
    window.location.href = APP_ROUTES.LOGIN;
  }
}
