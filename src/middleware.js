import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Public routes that don't need auth
  const publicRoutes = ["/login", "/signup"];

  if (!token && !publicRoutes.includes(request.nextUrl.pathname)) {
    // If not logged in and trying to access protected route → redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && ["/login", "/signup"].includes(request.nextUrl.pathname)) {
    // If logged in and tries to access login/signup → redirect to home (/)
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to everything except static files/api
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
