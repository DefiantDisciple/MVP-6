import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { User } from "@/lib/types"

// Mock user database
const mockUsers: Record<string, User> = {
  "demo@entity.com": {
    id: "entity-1",
    email: "demo@entity.com",
    name: "Ministry of Infrastructure",
    role: "entity",
    organizationName: "Ministry of Infrastructure",
    phone: "+267 123 4567",
    address: "Government Enclave, Gaborone",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  "demo@provider.com": {
    id: "provider-1",
    email: "demo@provider.com",
    name: "BuildCorp Services",
    role: "provider",
    organizationName: "BuildCorp Services Ltd",
    phone: "+267 234 5678",
    address: "Plot 123, Industrial Area, Gaborone",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  "demo@admin.com": {
    id: "admin-1",
    email: "demo@admin.com",
    name: "System Administrator",
    role: "admin",
    organizationName: "TenderHub Platform",
    phone: "+267 345 6789",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // Mock authentication (in production, verify password hash)
    if (password !== "demo123") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = mockUsers[email]

    if (!user || user.role !== role) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set HttpOnly cookie with user role
    const cookieStore = await cookies()
    cookieStore.set("user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Also set user ID for session management
    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationName: user.organizationName,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
