import { type NextRequest, NextResponse } from "next/server"
import type { Dispute } from "@/types/tender"

const mockDisputes: Dispute[] = [
  {
    id: "DIS-001",
    caseId: "CASE-2025-001",
    tenderId: "TND-003",
    tenderTitle: "School Building Construction",
    providerId: "PROV-123",
    reason: "Our technical proposal scored higher based on the published criteria.",
    filedAt: "2025-01-27T11:00:00Z",
    status: "Under Review",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const providerId = searchParams.get("providerId")
  const tenderId = searchParams.get("tid")

  let filtered = mockDisputes

  if (providerId) {
    filtered = filtered.filter((d) => d.providerId === providerId)
  }

  if (tenderId) {
    filtered = filtered.filter((d) => d.tenderId === tenderId)
  }

  return NextResponse.json(filtered)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenderId, tenderTitle, providerId, reason, attachments } = body

    const dispute: Dispute = {
      id: `DIS-${Date.now()}`,
      caseId: `CASE-2025-${String(mockDisputes.length + 1).padStart(3, "0")}`,
      tenderId,
      tenderTitle,
      providerId,
      reason,
      filedAt: new Date().toISOString(),
      status: "Pending",
      attachments: attachments || [],
    }

    mockDisputes.push(dispute)

    return NextResponse.json(dispute)
  } catch (error) {
    return NextResponse.json({ error: "Failed to file dispute" }, { status: 500 })
  }
}
