import { type NextRequest, NextResponse } from "next/server"
import { mockTenders } from "@/lib/mock-data"
import { cookies } from "next/headers"
import type { Tender } from "@/types/tender"
import { shouldUseMockData } from "@/lib/utils/user-helpers"
import { userStore } from "@/lib/db/store"

// Additional mock tender data for provider panels
const providerMockTenders: Tender[] = [
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
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value
    const orgId = cookieStore.get("org_id")?.value

    // Check if authentication is enabled
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true'
    const effectiveUserRole = userRole || 'entity'

    if (isAuthEnabled && !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use default values when authentication is disabled
    const effectiveUserId = userId || 'entity-1'

    const { searchParams } = new URL(request.url)
    const stage = searchParams.get("stage")
    const aggregate = searchParams.get("aggregate")
    const entityId = searchParams.get("entityId")
    const providerId = searchParams.get("providerId")

    // Check if user should see mock data (only demo users)
    const useMockData = shouldUseMockData(orgId)

    // If not a demo user, return empty array (real data - none yet)
    if (!useMockData) {
      return NextResponse.json({ tenders: [] })
    }

    // Use provider mock data for provider-related requests or when requesting provider-specific stages
    const providerStages = ["open", "notice", "awarded", "active", "closed"]
    const isProviderRequest = aggregate === "provider" || providerId ||
      (stage && stage.split("|").some(s => providerStages.includes(s)))

    let filteredTenders = isProviderRequest ? [...providerMockTenders] : [...mockTenders]

    // Filter by stage if provided
    if (stage) {
      const stages = stage.split("|")
      filteredTenders = filteredTenders.filter(t => stages.includes(t.stage))
    }

    // For awarded/active/closed stages with providerId, filter to show only provider's tenders
    if (providerId && (stage === "awarded" || stage === "active" || stage === "closed")) {
      // Mock: assume provider won TND-004, TND-005, TND-006
      filteredTenders = filteredTenders.filter((t) => ["TND-004", "TND-005", "TND-006"].includes(t.id))
    }

    // Filter by entity
    if (entityId) {
      filteredTenders = filteredTenders.filter((t) => t.entityId === entityId)
    }

    // Provider sees only published, clarification, and submission stage tenders
    if (effectiveUserRole === "provider") {
      filteredTenders = filteredTenders.filter((t) => ["published", "clarification", "submission"].includes(t.stage))
    }

    // If aggregate=provider is requested, return provider dashboard metrics
    if (aggregate === "provider") {
      const openCount = providerMockTenders.filter(t => t.stage === "open").length
      const closingSoonCount = providerMockTenders.filter(t => {
        if (t.stage !== "open") return false
        const closingDate = new Date(t.closingDate)
        const now = new Date()
        const daysUntilClosing = Math.ceil((closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilClosing <= 7 && daysUntilClosing > 0
      }).length
      const awardedCount = providerMockTenders.filter(t => t.stage === "awarded").length
      const activeCount = providerMockTenders.filter(t => t.stage === "active").length
      const completedCount = providerMockTenders.filter(t => t.stage === "closed").length

      const providerMetrics = {
        openCount,
        closingSoonCount,
        awardedCount,
        activeCount,
        completedCount,
        totalContractValue: providerMockTenders
          .filter(t => ["awarded", "active", "closed"].includes(t.stage))
          .reduce((sum, t) => sum + (t.contractValue || 0), 0)
      }

      return NextResponse.json({
        tenders: filteredTenders,
        providerMetrics
      })
    }

    // If aggregate is requested for provider, calculate provider-specific metrics
    if (aggregate === "provider") {
      const openTenders = filteredTenders.filter(t => ["published", "clarification", "submission"].includes(t.stage))
      const closingSoonTenders = openTenders.filter(t => {
        const deadline = new Date(t.submissionDeadline)
        const now = new Date()
        const daysUntilClose = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntilClose <= 7 && daysUntilClose > 0
      })

      // Find next closing date
      const nextClosingDate = openTenders.length > 0
        ? openTenders
          .map(t => new Date(t.submissionDeadline))
          .sort((a, b) => a.getTime() - b.getTime())[0]
        : null

      const providerMetrics = {
        openCount: openTenders.length,
        closingSoonCount: closingSoonTenders.length,
        nextClosingDate: nextClosingDate?.toISOString() || null
      }

      return NextResponse.json({
        tenders: filteredTenders,
        providerMetrics
      })
    }

    // If aggregate is requested, calculate performance metrics
    if (aggregate === "entity") {
      const published = filteredTenders.filter(t => ["published", "clarification", "submission"].includes(t.stage)).length
      const underEvaluation = filteredTenders.filter(t => t.stage === "evaluation").length
      const active = filteredTenders.filter(t => ["awarded", "active"].includes(t.stage)).length
      const completed = filteredTenders.filter(t => t.stage === "completed").length

      // Calculate average cycle days (mock calculation)
      const completedTenders = filteredTenders.filter(t => t.stage === "completed")
      const avgCycleDays = completedTenders.length > 0
        ? Math.round(completedTenders.reduce((sum, t) => {
          const created = new Date(t.createdAt)
          const completed = new Date(t.awardDeadline || t.submissionDeadline)
          const days = Math.abs(completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
          return sum + days
        }, 0) / completedTenders.length)
        : 0

      // Mock compliance percentage
      const compliancePercentage = 94

      const performanceSnapshot = {
        published,
        underEvaluation,
        active,
        completed,
        avgCycleDays,
        compliancePercentage
      }

      return NextResponse.json({
        tenders: filteredTenders,
        performance: performanceSnapshot
      })
    }

    // Return array directly for provider panels compatibility
    return NextResponse.json(filteredTenders)
  } catch (error) {
    console.error("[v0] Get tenders error:", error)
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
    const effectiveUserRole = userRole || 'entity'
    const effectiveUserId = userId || 'entity-1'

    if (isAuthEnabled && !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const newTender = {
      id: `tender-${Date.now()}`,
      entityId: effectiveUserId,
      ...body,
      stage: "draft",
      isSealed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockTenders.push(newTender)

    return NextResponse.json({ tender: newTender }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create tender error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
