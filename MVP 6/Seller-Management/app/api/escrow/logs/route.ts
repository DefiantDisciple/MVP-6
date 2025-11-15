import { type NextRequest, NextResponse } from "next/server"

interface EscrowLog {
  id: string
  projectId: string
  milestone: string
  amount: number
  status: "Released" | "Pending"
  releasedAt?: string
  signatures: { name: string; signedAt: string }[]
}

const mockEscrowLogs: EscrowLog[] = [
  {
    id: "ESC-001",
    projectId: "TND-005",
    milestone: "Phase 1: Site Preparation",
    amount: 3000000,
    status: "Released",
    releasedAt: "2024-12-20T00:00:00Z",
    signatures: [
      { name: "Project Manager", signedAt: "2024-12-18T10:00:00Z" },
      { name: "Technical Lead", signedAt: "2024-12-19T14:00:00Z" },
      { name: "Procuring Entity", signedAt: "2024-12-19T16:00:00Z" },
    ],
  },
  {
    id: "ESC-002",
    projectId: "TND-005",
    milestone: "Phase 2: Equipment Installation",
    amount: 5400000,
    status: "Pending",
    signatures: [
      { name: "Project Manager", signedAt: "2025-01-10T09:00:00Z" },
      { name: "Technical Lead", signedAt: "2025-01-10T15:00:00Z" },
    ],
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pid = searchParams.get("pid")

  if (pid) {
    return NextResponse.json(mockEscrowLogs.filter((log) => log.projectId === pid))
  }

  return NextResponse.json(mockEscrowLogs)
}
