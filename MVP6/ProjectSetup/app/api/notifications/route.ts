import { type NextRequest, NextResponse } from "next/server"
import { mockNotifications } from "@/lib/mock-data"
import { cookies } from "next/headers"
import { shouldUseMockData } from "@/lib/utils/user-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value
    const orgId = cookieStore.get("org_id")?.value
    const limit = parseInt(searchParams.get("limit") || "10")

    // Check if user should see mock data (only demo users)
    const useMockData = shouldUseMockData(orgId)

    // If not a demo user, return empty array (real data - none yet)
    if (!useMockData) {
      return NextResponse.json({ notifications: [] })
    }

    // Filter notifications by userId if provided
    let userNotifications = mockNotifications
    if (userId) {
      userNotifications = mockNotifications.filter((n) => n.userId === userId)
    }

    // Apply limit
    userNotifications = userNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    return NextResponse.json({ notifications: userNotifications })
  } catch (error) {
    console.error("[v0] Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
