import { type NextRequest, NextResponse } from "next/server"
import { mockDisputes } from "@/lib/mock-data"
import { cookies } from "next/headers"
import type { Dispute } from "@/types/tender"
import { shouldUseMockData } from "@/lib/utils/user-helpers"

// Additional mock disputes for provider panels
const providerMockDisputes: Dispute[] = [
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
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value
    const orgId = cookieStore.get("org_id")?.value

    // Check if authentication is enabled
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true'
    const effectiveUserRole = userRole || 'admin'
    const effectiveUserId = userId || 'provider-1'

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    // Check if user should see mock data (only demo users)
    const useMockData = shouldUseMockData(orgId)

    // If not a demo user, return empty array (real data - none yet)
    if (!useMockData) {
      return NextResponse.json({ disputes: [] })
    }

    // Use provider mock data for provider-related requests
    let filteredDisputes = providerId ? [...providerMockDisputes] : [...mockDisputes]

    // Filter by providerId if specified in query
    if (providerId) {
      filteredDisputes = filteredDisputes.filter((d) => d.providerId === providerId)
    } else if (effectiveUserRole === "provider" && isAuthEnabled) {
      filteredDisputes = filteredDisputes.filter((d) => d.providerId === effectiveUserId)
    }

    // If providerId is specified, also return dashboard metrics
    if (providerId) {
      const totalDisputes = filteredDisputes.length
      const pendingDisputes = filteredDisputes.filter(d => d.status === "Pending").length
      const underReviewDisputes = filteredDisputes.filter(d => d.status === "Under Review").length
      const resolvedDisputes = filteredDisputes.filter(d => d.status.startsWith("Resolved")).length

      const latestDispute = filteredDisputes.length > 0 ? filteredDisputes
        .sort((a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime())[0] : null

      const dashboardData = {
        totalCount: totalDisputes,
        pendingCount: pendingDisputes,
        underReviewCount: underReviewDisputes,
        resolvedCount: resolvedDisputes,
        latestStatus: latestDispute ? {
          status: latestDispute.status,
          caseId: latestDispute.caseId,
          filedAt: latestDispute.filedAt
        } : null
      }

      return NextResponse.json({
        disputes: filteredDisputes,
        dashboard: dashboardData
      })
    }

    // Return array directly for provider panels compatibility
    return NextResponse.json(filteredDisputes)
  } catch (error) {
    console.error("[v0] Get disputes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value

    // Check if authentication is enabled
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true'
    const effectiveUserRole = userRole || 'provider'
    const effectiveUserId = userId || 'provider-1'

    if (isAuthEnabled && effectiveUserRole !== "provider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()

    const newDispute = {
      id: `dispute-${Date.now()}`,
      tenderId: body.tenderId,
      providerId: effectiveUserId,
      providerName: body.providerName,
      reason: body.reason,
      details: body.details,
      evidenceUrls: body.evidenceUrls || [],
      status: "pending" as const,
      filedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockDisputes.push(newDispute)

    return NextResponse.json({ dispute: newDispute }, { status: 201 })
  } catch (error) {
    console.error("[v0] File dispute error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
