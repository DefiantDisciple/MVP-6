import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore, auditStore } from "@/lib/db/store"
import { verifyPassword } from "@/lib/auth/utils"
import { getRoleDashboard } from "@/lib/auth/permissions"

/**
 * Classic authentication login
 * Email + Password authentication for multi-tenant system
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Find user by email
    const user = userStore.findByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
    }

    // Verify password
    if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      // Log failed login attempt
      auditStore.create({
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userEmail: email,
        action: "login_failure",
        details: "Invalid password",
        timestamp: new Date(),
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set secure HTTP-only cookies
    const cookieStore = await cookies()

    cookieStore.set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    cookieStore.set("org_id", user.orgId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    // Update last login timestamp
    userStore.update(user.id, { lastLoginAt: new Date() })

    // Log successful login
    auditStore.create({
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userEmail: user.email,
      action: "login_success",
      details: `User logged in with classic auth`,
      timestamp: new Date(),
    })

    // Return safe user data with redirect URL
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId,
        organizationName: user.organizationName,
        authMethod: user.authMethod,
      },
      redirectUrl: getRoleDashboard(user.role),
    })
  } catch (error) {
    console.error("[Auth] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
