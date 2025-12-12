import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore } from "@/lib/db/store"
import { verifyPassword } from "@/lib/auth/utils"
import { createSessionData } from "@/lib/auth/session"

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
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session data (strips sensitive fields)
    const sessionData = createSessionData(user)

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

    // Return safe user data (no password hash)
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
    })
  } catch (error) {
    console.error("[Auth] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
