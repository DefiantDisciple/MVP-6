import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Authentication is disabled by default for development/demo purposes
  // To enable authentication, set NEXT_PUBLIC_ENABLE_AUTH=true in environment
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true'
  
  // If authentication is disabled, allow all routes
  if (!isAuthEnabled) {
    return NextResponse.next()
  }

  // Get user role from cookie
  const userRole = request.cookies.get("user_role")?.value

  // Public routes that don't require authentication
  const publicRoutes = ["/landing", "/login", "/api/auth/login"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    // If logged in and trying to access login page, redirect to dashboard
    if (pathname === "/login" && userRole) {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!userRole) {
    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based route protection and auto-redirect
  if (pathname.startsWith("/entity")) {
    if (userRole !== "entity") {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  } else if (pathname.startsWith("/provider")) {
    if (userRole !== "provider") {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  } else if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
    }
  } else if (pathname === "/") {
    // Redirect root to role-based dashboard
    return NextResponse.redirect(new URL(getRoleBasedRedirect(userRole), request.url))
  }

  return NextResponse.next()
}

function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case "entity":
      return "/entity/dashboard"
    case "provider":
      return "/provider/dashboard"
    case "admin":
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
