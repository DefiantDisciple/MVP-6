import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { resolution } = body

    if (!resolution) {
      return NextResponse.json({ error: "Resolution is required" }, { status: 400 })
    }

    // Mock: Update dispute status
    const dispute = {
      id: params.id,
      status: "resolved",
      resolution,
      resolvedAt: new Date().toISOString(),
    }

    return NextResponse.json(dispute)
  } catch (error) {
    return NextResponse.json({ error: "Failed to resolve dispute" }, { status: 500 })
  }
}
