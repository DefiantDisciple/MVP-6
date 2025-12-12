import { type NextRequest, NextResponse } from "next/server"
import { mockEscrowEvents } from "@/lib/mock-data"
import { shouldUseMockData } from "@/lib/utils/user-helpers"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenderId = searchParams.get("tenderId")

    const cookieStore = await cookies()
    const orgId = cookieStore.get("org_id")?.value

    // Check if user should see mock data (only demo users)
    const useMockData = shouldUseMockData(orgId)

    // If not a demo user, return empty array (real data - none yet)
    if (!useMockData) {
      return NextResponse.json({ events: [], logs: [] })
    }

    let filteredEvents = [...mockEscrowEvents]

    if (tenderId) {
      filteredEvents = filteredEvents.filter((event) => event.tenderId === tenderId)
    }

    // Sort by timestamp descending (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ events: filteredEvents })
  } catch (error) {
    console.error("[v0] Get escrow events error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
