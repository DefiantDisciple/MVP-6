import { type NextRequest, NextResponse } from "next/server"
import { mockClarifications } from "@/lib/mock-data"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value

    if (userRole !== "entity") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const clarifIndex = mockClarifications.findIndex((c) => c.id === id)

    if (clarifIndex === -1) {
      return NextResponse.json({ error: "Clarification not found" }, { status: 404 })
    }

    mockClarifications[clarifIndex] = {
      ...mockClarifications[clarifIndex],
      answer: body.answer,
      answeredAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ clarification: mockClarifications[clarifIndex] })
  } catch (error) {
    console.error("[v0] Answer clarification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
