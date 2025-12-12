/**
 * Data isolation layer for multi-tenant system
 * Ensures users only see data belonging to their organization
 */

import { Tender, VendorBid, Milestone, Clarification, Dispute } from "@/lib/types"

/**
 * Filter tenders by organization
 * Entity users see only their organization's tenders
 * Provider users see all published tenders (for bidding)
 * Admin sees all tenders
 */
export function filterTendersByOrg(
    tenders: Tender[],
    userRole: string,
    userOrgId: string
): Tender[] {
    if (userRole === "admin") {
        return tenders
    }

    if (userRole === "entity") {
        // Entity users only see their own tenders
        return tenders.filter((t) => t.entityId === userOrgId)
    }

    if (userRole === "provider") {
        // Providers see all published/active tenders (for bidding)
        return tenders.filter((t) =>
            ["published", "clarification", "submission"].includes(t.stage)
        )
    }

    return []
}

/**
 * Filter bids by organization
 * Entity users see bids for their tenders only
 * Provider users see only their own bids
 * Admin sees all bids
 */
export function filterBidsByOrg(
    bids: VendorBid[],
    tenders: Tender[],
    userRole: string,
    userOrgId: string
): VendorBid[] {
    if (userRole === "admin") {
        return bids
    }

    if (userRole === "entity") {
        // Entity sees bids for their tenders
        const entityTenderIds = tenders
            .filter((t) => t.entityId === userOrgId)
            .map((t) => t.id)
        return bids.filter((b) => entityTenderIds.includes(b.tenderId))
    }

    if (userRole === "provider") {
        // Provider sees only their own bids
        return bids.filter((b) => b.providerId === userOrgId)
    }

    return []
}

/**
 * Filter milestones by organization
 * Entity users see milestones for their awarded tenders
 * Provider users see milestones for their won contracts
 * Admin sees all milestones
 */
export function filterMilestonesByOrg(
    milestones: Milestone[],
    tenders: Tender[],
    bids: VendorBid[],
    userRole: string,
    userOrgId: string
): Milestone[] {
    if (userRole === "admin") {
        return milestones
    }

    if (userRole === "entity") {
        // Entity sees milestones for their tenders
        const entityTenderIds = tenders
            .filter((t) => t.entityId === userOrgId)
            .map((t) => t.id)
        return milestones.filter((m) => entityTenderIds.includes(m.tenderId))
    }

    if (userRole === "provider") {
        // Provider sees milestones for their awarded contracts
        const providerBidIds = bids
            .filter((b) => b.providerId === userOrgId && b.isPreferred)
            .map((b) => b.id)
        const providerTenderIds = bids
            .filter((b) => b.providerId === userOrgId)
            .map((b) => b.tenderId)
        return milestones.filter((m) => providerTenderIds.includes(m.tenderId))
    }

    return []
}

/**
 * Filter clarifications by organization
 */
export function filterClarificationsByOrg(
    clarifications: Clarification[],
    tenders: Tender[],
    userRole: string,
    userOrgId: string
): Clarification[] {
    if (userRole === "admin") {
        return clarifications
    }

    if (userRole === "entity") {
        const entityTenderIds = tenders
            .filter((t) => t.entityId === userOrgId)
            .map((t) => t.id)
        return clarifications.filter((c) => entityTenderIds.includes(c.tenderId))
    }

    if (userRole === "provider") {
        // Provider sees public clarifications for tenders they can bid on,
        // plus their own private clarifications
        const visibleTenderIds = tenders
            .filter((t) => ["published", "clarification", "submission"].includes(t.stage))
            .map((t) => t.id)
        return clarifications.filter(
            (c) =>
                (visibleTenderIds.includes(c.tenderId) && c.isPublic) ||
                c.providerId === userOrgId
        )
    }

    return []
}

/**
 * Filter disputes by organization
 */
export function filterDisputesByOrg(
    disputes: Dispute[],
    tenders: Tender[],
    userRole: string,
    userOrgId: string
): Dispute[] {
    if (userRole === "admin") {
        return disputes
    }

    if (userRole === "entity") {
        const entityTenderIds = tenders
            .filter((t) => t.entityId === userOrgId)
            .map((t) => t.id)
        return disputes.filter((d) => entityTenderIds.includes(d.tenderId))
    }

    if (userRole === "provider") {
        // Provider sees only their own disputes
        return disputes.filter((d) => d.providerId === userOrgId)
    }

    return []
}

/**
 * Check if user can view a specific tender
 */
export function canViewTender(
    tender: Tender,
    userRole: string,
    userOrgId: string
): boolean {
    if (userRole === "admin") {
        return true
    }

    if (userRole === "entity") {
        return tender.entityId === userOrgId
    }

    if (userRole === "provider") {
        return ["published", "clarification", "submission", "evaluation", "awarded"].includes(
            tender.stage
        )
    }

    return false
}

/**
 * Check if user can edit a tender
 */
export function canEditTender(
    tender: Tender,
    userRole: string,
    userOrgId: string
): boolean {
    if (userRole === "admin") {
        return true
    }

    if (userRole === "entity") {
        return tender.entityId === userOrgId && tender.stage === "draft"
    }

    return false
}

/**
 * Check if user can bid on a tender
 */
export function canBidOnTender(
    tender: Tender,
    userRole: string,
    userOrgId: string
): boolean {
    if (userRole !== "provider") {
        return false
    }

    return (
        tender.stage === "submission" &&
        tender.submissionDeadline > new Date()
    )
}
