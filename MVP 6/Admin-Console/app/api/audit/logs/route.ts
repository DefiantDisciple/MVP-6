import { type NextRequest, NextResponse } from "next/server"
import type { AuditLog } from "@/lib/types"

const mockLogs: AuditLog[] = [
  {
    id: "AUD-001",
    timestamp: "2024-02-18T15:30:00Z",
    actor: "admin@ppadb.gov.bw",
    event: "Dispute Filed",
    ref: "DSP-2024-005",
    refType: "Case",
    hash: "0xa1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
  },
  {
    id: "AUD-002",
    timestamp: "2024-02-16T14:00:00Z",
    actor: "admin@ppadb.gov.bw",
    event: "Dispute Filed",
    ref: "DSP-2024-001",
    refType: "Case",
    hash: "0xb2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890ab",
  },
  {
    id: "AUD-003",
    timestamp: "2024-02-15T17:00:00Z",
    actor: "System",
    event: "Tender Closed",
    ref: "TND-2024-001",
    refType: "Tender",
    hash: "0xc3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
  },
  {
    id: "AUD-004",
    timestamp: "2024-02-12T11:30:00Z",
    actor: "admin@ppadb.gov.bw",
    event: "Dispute Status Changed to Under Review",
    ref: "DSP-2024-002",
    refType: "Case",
    hash: "0xd4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "AUD-005",
    timestamp: "2024-02-10T14:30:00Z",
    actor: "System",
    event: "Escrow Released",
    ref: "TND-2024-003",
    refType: "Tender",
    hash: "0xe5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
  },
  {
    id: "AUD-006",
    timestamp: "2024-02-08T10:00:00Z",
    actor: "admin@ppadb.gov.bw",
    event: "User Role Changed",
    ref: "USR-2024-042",
    refType: "User",
    hash: "0xf67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    payload: {
      userId: "USR-2024-042",
      previousRole: "provider",
      newRole: "entity",
      reason: "User transferred to new organization",
    },
  },
  {
    id: "AUD-007",
    timestamp: "2024-02-05T16:45:00Z",
    actor: "admin@ppadb.gov.bw",
    event: "Dispute Resolved",
    ref: "DSP-2024-003",
    refType: "Case",
    hash: "0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345",
    payload: {
      disputeId: "DSP-2024-003",
      decision: "Upheld",
      reason: "Evaluation process found to have procedural errors",
    },
  },
  {
    id: "AUD-008",
    timestamp: "2024-02-03T09:20:00Z",
    actor: "System",
    event: "Standstill Period Started",
    ref: "TND-2024-003",
    refType: "Tender",
    hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tender = searchParams.get("tender")
  const caseId = searchParams.get("case")
  const user = searchParams.get("user")
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const eventType = searchParams.get("eventType")

  let filtered = mockLogs

  if (tender) {
    filtered = filtered.filter((log) => log.ref.includes(tender))
  }

  if (caseId) {
    filtered = filtered.filter((log) => log.ref.includes(caseId))
  }

  if (user) {
    filtered = filtered.filter((log) => log.actor.toLowerCase().includes(user.toLowerCase()))
  }

  if (from) {
    filtered = filtered.filter((log) => log.timestamp >= from)
  }

  if (to) {
    filtered = filtered.filter((log) => log.timestamp <= to)
  }

  if (eventType && eventType !== "All") {
    filtered = filtered.filter((log) => log.event.toLowerCase().includes(eventType.toLowerCase()))
  }

  return NextResponse.json(filtered)
}
