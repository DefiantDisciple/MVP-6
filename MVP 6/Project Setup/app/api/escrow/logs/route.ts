import { type NextRequest, NextResponse } from "next/server"
import { mockEscrowEvents } from "@/lib/mock-data"
import { escrowAdapter } from "@/lib/escrow-adapter"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenderId = searchParams.get("tenderId")
    const entityId = searchParams.get("entityId")
    const pid = searchParams.get("pid") // Project/tender ID for provider panels
    const providerId = searchParams.get("providerId")
    const summary = searchParams.get("summary") === "true"

    let filteredEvents = [...mockEscrowEvents]

    // Filter by tender ID or project ID
    if (tenderId || pid) {
      const targetId = tenderId || pid
      filteredEvents = filteredEvents.filter((e) => e.tenderId === targetId)
    }

    if (entityId) {
      // Filter events for specific entity (by performer or tender ownership)
      filteredEvents = filteredEvents.filter((e) => 
        e.performedBy === entityId || 
        e.tenderId?.startsWith('tender-') // Mock: assume all tenders belong to entity-1
      )
    }

    if (providerId) {
      // Filter events for specific provider
      filteredEvents = filteredEvents.filter((e) => e.performedBy === providerId)
    }

    // If summary is requested, calculate financial summary
    if (summary) {
      // For provider dashboard, calculate based on provider's awarded/active/closed tenders
      const providerTenderIds = ["TND-004", "TND-005", "TND-006"] // Mock: provider's won tenders
      const providerEvents = mockEscrowEvents.filter(e => 
        providerTenderIds.includes(e.tenderId || "")
      )

      const committed = providerEvents
        .filter(e => e.type === 'deposit')
        .reduce((sum, e) => sum + e.amount, 0)
      
      const released = providerEvents
        .filter(e => e.type === 'release')
        .reduce((sum, e) => sum + e.amount, 0)
      
      const held = providerEvents
        .filter(e => e.type === 'hold')
        .reduce((sum, e) => sum + e.amount, 0)

      const currentBalance = committed - released
      const pendingRelease = held
      
      const lastDisbursement = providerEvents
        .filter(e => e.type === 'release')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      // Recent transactions for provider
      const recentTransactions = providerEvents
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
        .map(e => ({
          id: e.id,
          type: e.type,
          amount: e.amount,
          description: e.description,
          timestamp: e.timestamp,
          tenderId: e.tenderId,
          milestoneId: e.milestoneId
        }))

      const financialSummary = {
        currentBalance,
        committed,
        released,
        pendingRelease,
        recentTransactions,
        lastDisbursement: lastDisbursement ? {
          amount: lastDisbursement.amount,
          date: lastDisbursement.timestamp,
          description: lastDisbursement.description
        } : null
      }

      return NextResponse.json({ 
        events: filteredEvents,
        summary: financialSummary 
      })
    }

    return NextResponse.json({ events: filteredEvents })
  } catch (error) {
    console.error("[v0] Get escrow logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
