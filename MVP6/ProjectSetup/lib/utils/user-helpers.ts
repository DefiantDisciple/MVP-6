/**
 * Helper utilities for user and organization management
 */

/**
 * Check if a user belongs to a demo organization
 * Demo organizations have IDs that include "-demo"
 */
export function isDemoUser(orgId: string | undefined): boolean {
    if (!orgId) return false
    return orgId.includes('-demo')
}

/**
 * Check if an organization is a demo organization
 */
export function isDemoOrg(orgId: string): boolean {
    return orgId.includes('-demo')
}

/**
 * Get the list of demo organization IDs
 */
export const DEMO_ORG_IDS = [
    'org-entity-demo',
    'org-provider-demo'
]

/**
 * Check if user should see mock data
 * Only demo users should see mock data
 * Real users (including founder admin) should see real/empty data
 */
export function shouldUseMockData(orgId: string | undefined): boolean {
    return isDemoUser(orgId)
}
