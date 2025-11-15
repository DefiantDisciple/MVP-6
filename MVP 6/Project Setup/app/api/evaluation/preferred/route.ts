import { type NextRequest, NextResponse } from "next/server"
import { mockBids } from "@/lib/mock-data"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value

    if (userRole !== "entity") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { bidId, tenderId } = body

    // Mark all bids for this tender as not preferred
    mockBids.forEach((bid) => {
      if (bid.tenderId === tenderId) {
        bid.isPreferred = false
      }
    })

    // Mark selected bid as preferred
    const bidIndex = mockBids.findIndex((b) => b.id === bidId)
    if (bidIndex !== -1) {
      mockBids[bidIndex].isPreferred = true
      mockBids[bidIndex].updatedAt = new Date()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Set preferred bid error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
