import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore } from "@/lib/db/store"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value
    const userRole = cookieStore.get("user_role")?.value

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = userStore.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return safe user data (no passwordHash)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId,
        organizationName: user.organizationName,
        authMethod: user.authMethod,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
