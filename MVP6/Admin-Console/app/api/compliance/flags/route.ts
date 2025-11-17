import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tenderId = searchParams.get("tenderId")

  // Mock anomalies based on tender ID
  const anomalies: Record<string, string[]> = {
    "TND-2024-003": ["Late evaluation - exceeded standard timeline by 5 days"],
    "TND-2024-006": [
      "Pre-standstill award attempt blocked by system on 2024-01-10",
      "Outlier price spread detected - highest bid 3.5x lowest bid",
    ],
  }

  return NextResponse.json({
    anomalies: anomalies[tenderId || ""] || [],
  })
}
