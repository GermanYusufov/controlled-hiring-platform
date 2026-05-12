import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/backend/utils/supabase/middleware";

const protectedRoutes = ["/dashboard", "/profile", "/employer", "/discovery"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // getUser() refreshes the session token if needed — do not use getSession() here
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/employer/:path*",
    "/discovery/:path*",
    "/login",
    "/signup",
  ],
};