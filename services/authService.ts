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
  // Bypass next-auth/react's signIn to avoid its internal URL resolution
  // which can construct absolute URLs pointing to localhost:3000.
  // Instead, POST directly to the credentials callback using relative URLs.
  try {
    // Get CSRF token
    const csrfRes = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();

    // POST to the credentials callback endpoint
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken,
        email: credentials.email,
        password: credentials.password,
      }),
      redirect: "follow",
    });

    // Check if the session was actually created
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user) {
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signOutUser(): Promise<void> {
  // Bypass next-auth/react's signOut entirely to avoid its internal
  // URL resolution which can redirect to localhost:3000 in production.
  // Instead, POST directly to the signout endpoint using a relative URL.
  try {
    // Get CSRF token from NextAuth's csrf endpoint
    const csrfRes = await fetch("/api/auth/csrf");
    const { csrfToken } = await csrfRes.json();

    // POST to signout endpoint with the CSRF token
    await fetch("/api/auth/signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ csrfToken }),
    });
  } catch {
    // Ignore errors — we always redirect below
  }

  // Always redirect to login on the current domain
  window.location.href = APP_ROUTES.LOGIN;
}
