import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    success: true,
    message: "Evaluation progress saved",
  })
}
