import { NextResponse } from "next/server"

// Mock detailed report data
const reportData: Record<string, any> = {
  "Q4 2025": {
    period: "Q4 2025",
    published: "2025-12-31",
    hash: "0x9a2f8e7c3d1b5a9e4f2c8d6b1a3e5f7c9b2d4e6a8c1f3e5d7b9a2c4e6f8a1c3e5",
    summary: {
      entities: 42,
      providers: 1287,
      tenders: 210,
      value: 184000000,
      avgCycle: 31,
      disputes: {
        filed: 14,
        resolved: 12,
      },
      compliance: 94,
      escrowReleases: 137,
    },
    stages: [
      { stage: "Open", count: 28, notes: "Currently accepting bids" },
      { stage: "Evaluation", count: 10, notes: "Under review" },
      { stage: "Notice of Award", count: 6, notes: "Winners announced" },
      { stage: "Awarded", count: 36, notes: "Contracts signed" },
      { stage: "Active", count: 55, notes: "Implementation phase" },
      { stage: "Closed", count: 75, notes: "Completed" },
    ],
    topEntities: [
      { entity: "Ministry of Infrastructure & Housing", tenders: 22, value: 85000000, cycle: 38 },
      { entity: "Ministry of Health & Wellness", tenders: 18, value: 42000000, cycle: 29 },
      { entity: "Department of Water Affairs", tenders: 15, value: 31000000, cycle: 27 },
      { entity: "Botswana Power Corporation", tenders: 12, value: 18000000, cycle: 25 },
      { entity: "Ministry of Education", tenders: 10, value: 8000000, cycle: 22 },
    ],
    escrow: {
      committed: 184000000,
      released: 136500000,
      pending: 47500000,
      avgVerifyDays: 2.4,
    },
    disputes: [
      { id: "DSP-032", tender: "Solar Farm 100MW", filedBy: "Renewable Energy Co.", decision: "Rejected", days: 9 },
      { id: "DSP-033", tender: "Hospital Equipment Supply", filedBy: "MedSupply Ltd.", decision: "Approved", days: 14 },
      { id: "DSP-034", tender: "Road Construction Phase 2", filedBy: "BuildTech (Pty)", decision: "Rejected", days: 7 },
      { id: "DSP-035", tender: "Water Pipeline Extension", filedBy: "AquaWorks", decision: "Approved", days: 11 },
    ],
    audit: [
      { type: "Tender Created", count: 210, hash: "0x9a2f8e7c3d1b5a9e", timestamp: "2025-11-10" },
      { type: "Bid Submitted", count: 1847, hash: "0x8cf7a2d5e1b9c3f6", timestamp: "2025-11-15" },
      { type: "Award Issued", count: 36, hash: "0x7be6c1f4a8d2e5b9", timestamp: "2025-12-01" },
      { type: "Contract Signed", count: 36, hash: "0x6ad5b2e3f7c1a9d4", timestamp: "2025-12-10" },
      { type: "Escrow Released", count: 137, hash: "0x5bc4a1d6e9f2c7a3", timestamp: "2025-12-20" },
    ],
  },
  "Q3 2025": {
    period: "Q3 2025",
    published: "2025-09-30",
    hash: "0x8cf7a2d5e1b9c3f6a4d8e2b7c5f1a9d3e6b8c2f4a7d1e5b9c3f6a8d2e4b7c1f5",
    summary: {
      entities: 38,
      providers: 1245,
      tenders: 198,
      value: 167000000,
      avgCycle: 29,
      disputes: {
        filed: 11,
        resolved: 10,
      },
      compliance: 92,
      escrowReleases: 125,
    },
    stages: [
      { stage: "Open", count: 24, notes: "Currently accepting bids" },
      { stage: "Evaluation", count: 8, notes: "Under review" },
      { stage: "Notice of Award", count: 5, notes: "Winners announced" },
      { stage: "Awarded", count: 32, notes: "Contracts signed" },
      { stage: "Active", count: 51, notes: "Implementation phase" },
      { stage: "Closed", count: 78, notes: "Completed" },
    ],
    topEntities: [
      { entity: "Ministry of Infrastructure & Housing", tenders: 20, value: 78000000, cycle: 35 },
      { entity: "Ministry of Health & Wellness", tenders: 16, value: 38000000, cycle: 27 },
      { entity: "Department of Water Affairs", tenders: 14, value: 29000000, cycle: 26 },
      { entity: "Botswana Power Corporation", tenders: 11, value: 15000000, cycle: 24 },
      { entity: "Ministry of Education", tenders: 9, value: 7000000, cycle: 21 },
    ],
    escrow: {
      committed: 167000000,
      released: 124000000,
      pending: 43000000,
      avgVerifyDays: 2.6,
    },
    disputes: [
      { id: "DSP-028", tender: "Bridge Construction", filedBy: "Infrastructure Plus", decision: "Approved", days: 12 },
      { id: "DSP-029", tender: "IT Equipment Procurement", filedBy: "TechSolutions", decision: "Rejected", days: 8 },
      { id: "DSP-030", tender: "School Building Project", filedBy: "EduBuild Ltd.", decision: "Rejected", days: 6 },
      { id: "DSP-031", tender: "Medical Supplies", filedBy: "HealthCare Imports", decision: "Approved", days: 10 },
    ],
    audit: [
      { type: "Tender Created", count: 198, hash: "0x8cf7a2d5e1b9c3f6", timestamp: "2025-08-12" },
      { type: "Bid Submitted", count: 1692, hash: "0x7be6c1f4a8d2e5b9", timestamp: "2025-08-18" },
      { type: "Award Issued", count: 32, hash: "0x6ad5b2e3f7c1a9d4", timestamp: "2025-09-05" },
      { type: "Contract Signed", count: 32, hash: "0x5bc4a1d6e9f2c7a3", timestamp: "2025-09-15" },
      { type: "Escrow Released", count: 125, hash: "0x4ad3b8e5f1c9a2d7", timestamp: "2025-09-25" },
    ],
  },
}

export async function GET(request: Request, { params }: { params: Promise<{ period: string }> }) {
  const { period } = await params
  const data = reportData[period]

  if (!data) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
