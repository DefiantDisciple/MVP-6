import { type NextRequest, NextResponse } from "next/server"
import type { Tender } from "@/types/tender"

// Mock tender data
const mockTenders: Tender[] = [
  {
    id: "TND-001",
    title: "National Road Infrastructure Upgrade",
    postedDate: "2025-01-15T08:00:00Z",
    closingDate: "2025-02-15T17:00:00Z",
    category: "Infrastructure",
    procuringEntity: "Ministry of Transport",
    stage: "open",
    description: "Upgrade of national road network including resurfacing and expansion.",
    clarificationsCutoff: "2025-02-08T17:00:00Z",
    attachments: [
      { name: "Technical Specs.pdf", url: "#" },
      { name: "Site Survey.pdf", url: "#" },
    ],
  },
  {
    id: "TND-002",
    title: "Hospital Equipment Procurement",
    postedDate: "2025-01-20T08:00:00Z",
    closingDate: "2025-02-20T17:00:00Z",
    category: "Healthcare",
    procuringEntity: "Ministry of Health",
    stage: "open",
    description: "Supply and installation of medical equipment for regional hospitals.",
    clarificationsCutoff: "2025-02-13T17:00:00Z",
    attachments: [{ name: "Equipment List.pdf", url: "#" }],
  },
  {
    id: "TND-003",
    title: "School Building Construction",
    postedDate: "2025-01-05T08:00:00Z",
    closingDate: "2025-01-25T17:00:00Z",
    category: "Construction",
    procuringEntity: "Ministry of Education",
    stage: "notice",
    preferredProvider: "BuildCo Ltd",
    noticeDate: "2025-01-26T10:00:00Z",
    contractValue: 5500000,
  },
  {
    id: "TND-004",
    title: "Water Supply System Upgrade",
    postedDate: "2024-12-01T08:00:00Z",
    closingDate: "2024-12-20T17:00:00Z",
    category: "Utilities",
    procuringEntity: "Water Utilities Corporation",
    stage: "awarded",
    contractValue: 8200000,
    awardDate: "2025-01-10T00:00:00Z",
  },
  {
    id: "TND-005",
    title: "Solar Power Installation",
    postedDate: "2024-11-01T08:00:00Z",
    closingDate: "2024-11-25T17:00:00Z",
    category: "Energy",
    procuringEntity: "Botswana Power Corporation",
    stage: "active",
    contractValue: 12000000,
    awardDate: "2024-12-05T00:00:00Z",
    currentMilestone: "Phase 2: Equipment Installation",
    progressPercent: 45,
    signaturesCompleted: 2,
    signaturesTotal: 3,
    escrowStatus: "Pending Signatures",
  },
  {
    id: "TND-006",
    title: "IT Infrastructure Modernization",
    postedDate: "2024-09-01T08:00:00Z",
    closingDate: "2024-09-30T17:00:00Z",
    category: "Technology",
    procuringEntity: "Department of ICT",
    stage: "closed",
    contractValue: 3500000,
    awardDate: "2024-10-10T00:00:00Z",
    completionDate: "2025-01-05T00:00:00Z",
    auditRef: "89ab4f2c1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const stage = searchParams.get("stage")
  const providerId = searchParams.get("providerId")

  let filtered = mockTenders

  if (stage) {
    filtered = filtered.filter((t) => t.stage === stage)
  }

  // For awarded/active/closed, filter by providerId (mock: only show if providerId matches)
  if (providerId && (stage === "awarded" || stage === "active" || stage === "closed")) {
    // Mock: assume provider won TND-004, TND-005, TND-006
    filtered = filtered.filter((t) => ["TND-004", "TND-005", "TND-006"].includes(t.id))
  }

  return NextResponse.json(filtered)
}
