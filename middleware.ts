import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { APP_ROUTES } from "@/constants";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = nextUrl.pathname.startsWith("/login");

  // Build redirect base from actual request headers to avoid
  // NextAuth resolving the URL to localhost via NEXTAUTH_URL
  const proto = req.headers.get("x-forwarded-proto") ?? nextUrl.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? nextUrl.host;
  const origin = `${proto}://${host}`;

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, origin));
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
