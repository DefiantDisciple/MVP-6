import { NextResponse } from "next/server"
import type { EscrowSummary } from "@/lib/types"

export async function GET() {
  const mockSummary: EscrowSummary = {
    committed: 45750000,
    released: 32500000,
    pendingRelease: 13250000,
  }

  return NextResponse.json(mockSummary)
}
