import { type NextRequest, NextResponse } from "next/server"
import { mockTenders, mockBids } from "@/lib/mock-data"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { bidId } = body

    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value
    
    // Check if Preview Mode is enabled
    const isPreviewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true'
    const effectiveUserRole = userRole || 'entity'

    if (!isPreviewMode && effectiveUserRole !== "entity") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Find the tender
    const tenderIndex = mockTenders.findIndex((t) => t.id === id)
    if (tenderIndex === -1) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    // Find the winning bid
    const winningBid = mockBids.find((b) => b.id === bidId)
    if (!winningBid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    // Update tender status to awarded
    mockTenders[tenderIndex] = {
      ...mockTenders[tenderIndex],
      stage: "awarded",
      awardedBidId: bidId,
      awardedAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ 
      message: "Tender awarded successfully",
      tender: mockTenders[tenderIndex],
      winningBid 
    })
  } catch (error) {
    console.error("[v0] Award tender error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
