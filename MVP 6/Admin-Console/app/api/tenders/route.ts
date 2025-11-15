import { type NextRequest, NextResponse } from "next/server"
import type { Tender } from "@/lib/types"

const mockTenders: Tender[] = [
  {
    id: "TND-2024-001",
    title: "Road Maintenance Services - Northern District",
    entity: "Ministry of Transport",
    stage: "Open",
    postedDate: "2024-01-15",
    closesDate: "2024-02-15",
    submissions: 12,
    status: "Accepting submissions",
  },
  {
    id: "TND-2024-002",
    title: "Medical Equipment Procurement",
    entity: "Ministry of Health",
    stage: "Evaluation",
    postedDate: "2024-01-10",
    closesDate: "2024-02-10",
    submissions: 8,
    status: "Technical evaluation in progress",
  },
  {
    id: "TND-2024-003",
    title: "School Building Construction - Gaborone",
    entity: "Ministry of Education",
    stage: "Notice",
    postedDate: "2024-01-05",
    standstillDate: "2025-01-20",
    submissions: 15,
    status: "Standstill period active",
    anomalies: ["Late eval"],
  },
  {
    id: "TND-2024-004",
    title: "IT Infrastructure Upgrade",
    entity: "Ministry of Finance",
    stage: "Awarded",
    postedDate: "2023-12-20",
    submissions: 6,
    status: "Contract awarded",
  },
  {
    id: "TND-2024-005",
    title: "Water Pipeline Installation",
    entity: "Water Utilities Corporation",
    stage: "Active",
    postedDate: "2023-11-15",
    submissions: 10,
    status: "Project ongoing",
  },
  {
    id: "TND-2023-098",
    title: "Solar Panel Installation - Rural Areas",
    entity: "Ministry of Energy",
    stage: "Closed",
    postedDate: "2023-10-01",
    submissions: 9,
    status: "Project completed",
  },
  {
    id: "TND-2024-006",
    title: "Security Systems for Government Buildings",
    entity: "Ministry of Defence",
    stage: "Notice",
    postedDate: "2024-01-08",
    standstillDate: "2025-01-18",
    submissions: 5,
    status: "Standstill period active",
    anomalies: ["Pre-standstill award attempt (blocked)", "Outlier price spread"],
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const stage = searchParams.get("stage")
  const entity = searchParams.get("entity")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  let filtered = mockTenders

  if (stage && stage !== "All") {
    filtered = filtered.filter((t) => t.stage === stage)
  }

  if (entity) {
    filtered = filtered.filter((t) => t.entity.toLowerCase().includes(entity.toLowerCase()))
  }

  if (from) {
    filtered = filtered.filter((t) => t.postedDate >= from)
  }

  if (to) {
    filtered = filtered.filter((t) => t.postedDate <= to)
  }

  return NextResponse.json(filtered)
}
