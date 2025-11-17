import { type NextRequest, NextResponse } from "next/server"
import { mockBids } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bid = mockBids.find((b) => b.id === id)

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    return NextResponse.json({ bid })
  } catch (error) {
    console.error("[v0] Get bid error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
