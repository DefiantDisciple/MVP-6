import { type NextRequest, NextResponse } from "next/server"
import type { Tender } from "@/lib/types"

// Mock data generator
function getMockTenders(stage: string): Tender[] {
  const baseDate = new Date()

  const mockData: Record<string, Tender[]> = {
    open: [
      {
        id: "TND-2024-001",
        title: "Road Infrastructure Upgrade Project",
        postedDate: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 12,
        status: "Open",
        documents: [
          { id: "1", name: "Technical Specifications.pdf", size: "2.4 MB", uploadDate: new Date().toISOString() },
          { id: "2", name: "Terms and Conditions.pdf", size: "850 KB", uploadDate: new Date().toISOString() },
        ],
      },
      {
        id: "TND-2024-002",
        title: "School Building Construction - Phase 2",
        postedDate: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 8,
        status: "Open",
        documents: [],
      },
    ],
    evaluation: [
      {
        id: "TND-2024-003",
        title: "Healthcare Equipment Procurement",
        postedDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 15,
        status: "Under Evaluation",
      },
    ],
    notice: [
      {
        id: "TND-2024-004",
        title: "Water Supply System Expansion",
        postedDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 10,
        status: "Open for Dispute",
        preferredProvider: "Aqua Solutions Ltd",
        estimatedValue: 4500000,
        noticeDate: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    awarded: [
      {
        id: "TND-2024-005",
        title: "IT Infrastructure Modernization",
        postedDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 7,
        status: "Escrow Initialized",
        winningProvider: "Tech Innovations Inc",
        contractValue: 3200000,
        awardDate: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    active: [
      {
        id: "TND-2024-006",
        title: "Public Transport Fleet Upgrade",
        postedDate: new Date(baseDate.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 9,
        status: "In Progress",
        winningProvider: "Transport Solutions Ltd",
        contractValue: 8500000,
        currentMilestone: "Phase 2: Vehicle Delivery",
        progress: 65,
        signatures: { current: 3, total: 5 },
        escrowStatus: "Auto-released",
      },
    ],
    closed: [
      {
        id: "TND-2023-089",
        title: "Community Center Construction",
        postedDate: new Date(baseDate.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        closingTime: new Date(baseDate.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        submissions: 11,
        status: "Completed",
        winningProvider: "BuildRight Construction",
        contractValue: 2100000,
        completionDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        auditRef: "AUD-2023-089-7F3E9A",
      },
    ],
  }

  return mockData[stage] || []
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const stage = searchParams.get("stage") || "open"

  const tenders = getMockTenders(stage)

  return NextResponse.json(tenders)
}
