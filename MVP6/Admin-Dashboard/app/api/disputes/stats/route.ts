import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    activeDisputes: 7,
    awaitingDecision: 4,
    avgResolutionDays: 14,
  }

  return NextResponse.json(data)
}
