import { type NextRequest, NextResponse } from "next/server"
import { mockTenders } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tender = mockTenders.find((t) => t.id === id)

    if (!tender) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    return NextResponse.json({ tender })
  } catch (error) {
    console.error("[v0] Get tender error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const tenderIndex = mockTenders.findIndex((t) => t.id === id)

    if (tenderIndex === -1) {
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    mockTenders[tenderIndex] = {
      ...mockTenders[tenderIndex],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ tender: mockTenders[tenderIndex] })
  } catch (error) {
    console.error("[v0] Update tender error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
