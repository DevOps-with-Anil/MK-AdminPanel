
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Root redirect
//   if (pathname === "/") {
//     return NextResponse.redirect(new URL("/auth/signin", request.nextUrl.origin));
//   }

//   const token = request.cookies.get("r_token")?.value;
//   const roleType = request.cookies.get("r_roleType")?.value;

//   const isAuthPage = pathname.startsWith("/auth");
//   const isRootPage = pathname.startsWith("/root");

//   // Logged-in users → block auth pages
//   if (token && isAuthPage) {
//     if (roleType === "ROOT") {
//       return NextResponse.redirect(new URL("/root/dashboard", request.nextUrl.origin));
//     }
//   }

//   // Not logged in → protect routes
//   if (!token && isRootPage) {
//     return NextResponse.redirect(new URL("/auth/signin", request.nextUrl.origin));
//   }

//   // // Role-based access
//   // if (token && roleType === "ROOT") {
//   //   if (!pathname.startsWith("/root")) {
//   //     return NextResponse.redirect(new URL("/root/dashboard", request.nextUrl.origin));
//   //   }
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/root/:path*", "/auth/:path*"],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { tokenStorage } from "@/utils/token";


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL("/auth/signin", request.nextUrl.origin)
    );
  }

  const isAuthPage = pathname.startsWith("/auth");
  const isRootPage = pathname.startsWith("/root");
  const isAuthenticated = request.cookies.get('connect.sid')?.value;

  // // console.log("Auth status. : " + isAuthenticated);

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(
      new URL("/root/dashboard", request.nextUrl.origin)
    );
  }

  // not logged in → protect root
  if (!isAuthenticated && isRootPage) {
    return NextResponse.redirect(
      new URL("/auth/signin", request.nextUrl.origin)
    );
  }

  return NextResponse.next();
}