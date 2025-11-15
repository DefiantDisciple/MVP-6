import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId } = body

    const withdrawnAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      submissionId,
      withdrawnAt,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to withdraw submission" }, { status: 500 })
  }
}
