
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get("mk_token")?.value;
//   const roleType = request.cookies.get("mk_roleType")?.value; // ✅ "ROOT" | "ADMIN"

//   const isAuthPage = pathname.startsWith("/auth");
//   const isRootPage = pathname.startsWith("/root");
//   const isAdminPage = pathname.startsWith("/admin");

//   // 1. Logged-in users → block auth pages
//   if (token && isAuthPage) {
//     if (roleType === "ROOT") {
//       return NextResponse.redirect(new URL("/root/dashboard", request.url));
//     }
//     if (roleType === "ADMIN") {
//       return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//     }
//   }

//   // 2. Not logged in → protect routes
//   if (!token) {
//     if (isRootPage) {
//       return NextResponse.redirect(new URL("/auth/root-login", request.url));
//     }
//     if (isAdminPage) {
//       return NextResponse.redirect(new URL("/auth/admin-login", request.url));
//     }
//   }

//   // 3. Role-based access control
//   if (token) {
//     // ROOT should NOT access /admin
//     if (roleType === "ROOT" && isAdminPage) {
//       return NextResponse.redirect(new URL("/root/dashboard", request.url));
//     }

//     // ADMIN should NOT access /root
//     if (roleType === "ADMIN" && isRootPage) {
//       return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/root/:path*", "/admin/:path*", "/auth/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("auth/root-login", request.url));
  }

  // Force HTTPS (optional)
  if (request.nextUrl.protocol === "http:") {
   if (
  process.env.NODE_ENV === "production" &&
  request.nextUrl.protocol === "http:"
) {
  const httpsUrl = request.nextUrl.clone();
  httpsUrl.protocol = "https:";
  return NextResponse.redirect(httpsUrl);
}
  }

  const token = request.cookies.get("mk_token")?.value;
  const roleType = request.cookies.get("mk_roleType")?.value;

  const isAuthPage = pathname.startsWith("/auth");
  const isRootPage = pathname.startsWith("/root");
  const isAdminPage = pathname.startsWith("/admin");

  // 1. Logged-in users → block auth pages
  if (token && isAuthPage) {
    if (roleType === "ROOT") {
      return NextResponse.redirect(new URL("/root/dashboard", request.url));
    }
    if (roleType === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // 2. Not logged in → protect routes
  if (!token) {
    if (isRootPage) {
      return NextResponse.redirect(new URL("/auth/root-login", request.url));
    }
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    }
  }

  // 3. Role-based access
  if (token) {
    if (roleType === "ROOT" && isAdminPage) {
      return NextResponse.redirect(new URL("/root/dashboard", request.url));
    }

    if (roleType === "ADMIN" && isRootPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/root/:path*", "/admin/:path*", "/auth/:path*"],
};