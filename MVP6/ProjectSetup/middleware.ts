import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Authentication is enabled by default for production
  // Set NEXT_PUBLIC_ENABLE_AUTH=false to disable (demo mode only)
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH !== 'false'

  // Demo routes - always accessible without auth
  const demoRoutes = ["/demo"]
  const isDemoRoute = demoRoutes.some((route) => pathname.startsWith(route))

  if (isDemoRoute) {
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/landing",
    "/login",
    "/auth/accept-invite",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/accept-invite",
    "/api/auth/ii-login",
    "/api/auth/link-ii",
  ]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // If auth is disabled, allow all routes (demo mode)
  if (!isAuthEnabled) {
    return NextResponse.next()
  }

  // Get user session from cookies
  const userRole = request.cookies.get("user_role")?.value
  const userId = request.cookies.get("user_id")?.value
  const orgId = request.cookies.get("org_id")?.value

  if (isPublicRoute) {
    // If logged in and trying to access login page, redirect to dashboard
    if (pathname === "/login" && userRole) {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!userRole || !userId || !orgId) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based route protection
  // ADMIN can access all routes
  if (userRole === "ADMIN") {
    return NextResponse.next()
  }

  // Entity users can only access entity routes
  if (pathname.startsWith("/entity")) {
    if (userRole !== "ENTITY_ADMIN" && userRole !== "ENTITY_USER") {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  }
  // Provider users can only access provider routes
  else if (pathname.startsWith("/provider")) {
    if (userRole !== "PROVIDER_ADMIN" && userRole !== "PROVIDER_USER") {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  }
  // Admin routes are ADMIN-only
  else if (pathname.startsWith("/admin")) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  }
  // Redirect root to role-based dashboard
  else if (pathname === "/") {
    return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
  }

  return NextResponse.next()
}

function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case "ENTITY_ADMIN":
    case "ENTITY_USER":
      return "/entity/dashboard"
    case "PROVIDER_ADMIN":
    case "PROVIDER_USER":
      return "/provider/dashboard"
    case "ADMIN":
      return "/admin/dashboard"
    default:
      return "/login"
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
