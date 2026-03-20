import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token
  const token = request.cookies.get("mk_token")?.value;

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  // Logged-in user visiting login page
  if (token && isAuthPage) {
     console.log("User still logged in.");
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }
  // Not logged-in user visiting admin pages
  if (!token && isAdminPage) {
    return NextResponse.redirect(
      new URL("/auth/root-login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};