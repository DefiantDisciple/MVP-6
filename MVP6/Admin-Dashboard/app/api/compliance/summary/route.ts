import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    lateEvaluations: 3,
    blockedAwards: 2,
    bidOutliers: 1,
  }

  return NextResponse.json(data)
}
