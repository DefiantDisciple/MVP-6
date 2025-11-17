import { type NextRequest, NextResponse } from "next/server"
import { mockBids } from "@/lib/mock-data"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value

    if (userRole !== "provider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const bidIndex = mockBids.findIndex((b) => b.id === id && b.providerId === userId)

    if (bidIndex === -1) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 })
    }

    mockBids[bidIndex] = {
      ...mockBids[bidIndex],
      isWithdrawn: true,
      withdrawnAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ bid: mockBids[bidIndex] })
  } catch (error) {
    console.error("[v0] Withdraw bid error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
