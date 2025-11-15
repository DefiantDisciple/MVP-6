import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get("entityId") || "entity-1"

    // Mock KYC & KYB status data
    const entityStatus = {
      entityId,
      kyc: {
        status: "verified",
        statusText: "Verified",
        updatedDate: "2024-03-15T09:00:00Z",
        expiryDate: "2025-03-15T09:00:00Z",
        complianceScore: 98,
        documents: [
          { type: "Identity Verification", status: "approved", date: "2024-03-15T09:00:00Z" },
          { type: "Address Verification", status: "approved", date: "2024-03-14T15:30:00Z" },
          { type: "Financial Standing", status: "approved", date: "2024-03-13T11:20:00Z" }
        ]
      },
      kyb: {
        status: "verified",
        statusText: "Verified",
        updatedDate: "2024-02-28T14:45:00Z",
        expiryDate: "2025-02-28T14:45:00Z",
        complianceScore: 95,
        documents: [
          { type: "Business Registration", status: "approved", date: "2024-02-28T14:45:00Z" },
          { type: "Tax Compliance Certificate", status: "approved", date: "2024-02-27T10:15:00Z" },
          { type: "Procurement Authorization", status: "approved", date: "2024-02-26T16:30:00Z" },
          { type: "Financial Audit Report", status: "approved", date: "2024-02-25T13:00:00Z" }
        ]
      },
      lastReview: "2024-11-01T10:00:00Z",
      nextReview: "2024-12-01T10:00:00Z"
    }

    return NextResponse.json({ status: entityStatus })
  } catch (error) {
    console.error("[v0] Get entity status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
