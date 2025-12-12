import { type NextRequest, NextResponse } from "next/server"
import type { Submission, Receipt } from "@/types/tender"
import { shouldUseMockData } from "@/lib/utils/user-helpers"
import { cookies } from "next/headers"

// Mock submissions storage
const mockSubmissions: Submission[] = [
  {
    id: "SUB-001",
    tenderId: "TND-001",
    providerId: "PROV-123",
    tenderTitle: "National Road Infrastructure Upgrade",
    submittedAt: "2025-01-20T14:30:00Z",
    technicalHash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    financialHash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    financialSealed: true,
    status: "Submitted",
    auditLog: [
      {
        timestamp: "2025-01-20T14:30:00Z",
        action: "Initial submission",
        actor: "PROV-123",
        hash: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
      },
    ],
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const providerId = searchParams.get("providerId")

  const cookieStore = await cookies()
  const orgId = cookieStore.get("org_id")?.value

  // Check if user should see mock data (only demo users)
  const useMockData = shouldUseMockData(orgId)

  // If not a demo user, return empty array (real data - none yet)
  if (!useMockData) {
    return NextResponse.json({ submissions: [] })
  }

  // Filter by providerId if provided
  let filteredSubmissions = mockSubmissions
  if (providerId) {
    filteredSubmissions = mockSubmissions.filter((s) => s.providerId === providerId)
  }

  return NextResponse.json({ submissions: filteredSubmissions })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenderId, providerId, tenderTitle, technicalHash, financialHash } = body

    const submission: Submission = {
      id: `SUB-${Date.now()}`,
      tenderId,
      providerId,
      tenderTitle,
      submittedAt: new Date().toISOString(),
      technicalHash,
      financialHash,
      financialSealed: true,
      status: "Submitted",
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: "Initial submission",
          actor: providerId,
          hash: technicalHash.substring(0, 16),
        },
      ],
    }

    mockSubmissions.push(submission)

    const receipts: Receipt[] = [
      {
        documentType: "technical",
        sha256: technicalHash,
        uploadedAt: submission.submittedAt,
        sealed: false,
      },
      {
        documentType: "financial",
        sha256: financialHash,
        uploadedAt: submission.submittedAt,
        sealed: true,
      },
    ]

    return NextResponse.json({ submission, receipts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}
