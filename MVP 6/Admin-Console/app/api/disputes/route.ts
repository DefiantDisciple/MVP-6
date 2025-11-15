import { NextResponse } from "next/server"
import type { Dispute } from "@/lib/types"

const mockDisputes: Dispute[] = [
  {
    id: "DSP-2024-001",
    tenderId: "TND-2024-002",
    tenderTitle: "Medical Equipment Procurement",
    provider: "MedTech Solutions Ltd",
    filedOn: "2024-02-16",
    status: "Pending",
    slaRemaining: 8,
    reason: "Technical evaluation scores appear inconsistent with submitted documentation.",
    attachments: ["technical_proposal_v2.pdf", "compliance_checklist.pdf"],
  },
  {
    id: "DSP-2024-002",
    tenderId: "TND-2024-003",
    tenderTitle: "School Building Construction - Gaborone",
    provider: "BuildRight Construction",
    filedOn: "2024-02-12",
    status: "Under Review",
    slaRemaining: 5,
  },
  {
    id: "DSP-2024-003",
    tenderId: "TND-2024-001",
    tenderTitle: "Road Maintenance Services - Northern District",
    provider: "RoadPro Services",
    filedOn: "2024-02-05",
    status: "Resolved - Upheld",
    slaRemaining: 0,
  },
  {
    id: "DSP-2024-004",
    tenderId: "TND-2024-004",
    tenderTitle: "IT Infrastructure Upgrade",
    provider: "TechNet Botswana",
    filedOn: "2024-01-28",
    status: "Resolved - Rejected",
    slaRemaining: 0,
  },
  {
    id: "DSP-2024-005",
    tenderId: "TND-2024-003",
    tenderTitle: "School Building Construction - Gaborone",
    provider: "Delta Constructors",
    filedOn: "2024-02-18",
    status: "Pending",
    slaRemaining: 2,
  },
]

export async function GET() {
  return NextResponse.json(mockDisputes)
}
