import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Frontend Route Protection using Proxy (Next.js 16 / Module 48-1)
 * Intercepts requests before reaching page components to guard private routes.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/add-book", "/my-books", "/my-borrows", "/profile"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. Redirect unauthenticated users trying to access protected routes
  if (!sessionCookie && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth pages (login, register)
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Aliased as default & middleware for full compatibility across Next.js tooling
export const middleware = proxy;
export default proxy;

export const config = {
  matcher: [
    "/add-book",
    "/add-book/:path*",
    "/my-books",
    "/my-books/:path*",
    "/my-borrows",
    "/my-borrows/:path*",
    "/profile",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
