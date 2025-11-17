import { type NextRequest, NextResponse } from "next/server"
import { mockAuditEvents } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const source = searchParams.get("source")
    const kind = searchParams.get("kind")

    let filteredEvents = [...mockAuditEvents]

    if (source) {
      filteredEvents = filteredEvents.filter((event) => event.source === source)
    }

    if (kind) {
      filteredEvents = filteredEvents.filter((event) => event.kind === kind)
    }

    // Sort by timestamp descending (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply limit
    filteredEvents = filteredEvents.slice(0, limit)

    return NextResponse.json({ events: filteredEvents })
  } catch (error) {
    console.error("[v0] Get audit events error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
