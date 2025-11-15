import { type NextRequest, NextResponse } from "next/server"
import { mockNotifications } from "@/lib/mock-data"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "10")
    
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
