import { type NextRequest, NextResponse } from "next/server"
import type { Dispute } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tenderId = searchParams.get("tid")

  // Mock disputes data
  const disputes: Dispute[] = []

  return NextResponse.json(disputes)
}
