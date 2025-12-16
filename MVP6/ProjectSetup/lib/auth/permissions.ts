/**
 * Role-based permissions system
 * Defines what each role can do in the system
 */

import { Role } from "@/lib/types"

export type Permission =
    | "view_all_orgs"          // View all organizations
    | "manage_all_users"       // Manage users across all orgs
    | "invite_any_role"        // Invite users to any org with any role
    | "view_own_org"           // View own organization data
    | "invite_org_users"       // Invite users to own organization
    | "manage_org_users"       // Manage users in own organization
    | "create_tenders"         // Create tender opportunities
    | "manage_tenders"         // Manage tender lifecycle
    | "submit_bids"            // Submit bids to tenders
    | "manage_bids"            // Manage own bids
    | "view_evaluations"       // View evaluation results
    | "create_evaluations"     // Create/submit evaluations

/**
 * Role to permissions mapping
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    ADMIN: [
        "view_all_orgs",
        "manage_all_users",
        "invite_any_role",
        "view_own_org",
        "create_tenders",
        "manage_tenders",
        "submit_bids",
        "manage_bids",
        "view_evaluations",
        "create_evaluations",
    ],
    ENTITY_ADMIN: [
        "view_own_org",
        "invite_org_users",
        "manage_org_users",
        "create_tenders",
        "manage_tenders",
        "view_evaluations",
        "create_evaluations",
    ],
    ENTITY_USER: [
        "view_own_org",
        "view_evaluations",
    ],
    PROVIDER_ADMIN: [
        "view_own_org",
        "invite_org_users",
        "manage_org_users",
        "submit_bids",
        "manage_bids",
    ],
    PROVIDER_USER: [
        "view_own_org",
        "submit_bids",
    ],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Check if a role can invite another role
 */
export function canInviteRole(inviterRole: Role, targetRole: Role, isSameOrg: boolean): boolean {
    // Only ADMIN can invite ADMIN
    if (targetRole === "ADMIN") {
        return inviterRole === "ADMIN"
    }

    // ADMIN can invite anyone to any org
    if (inviterRole === "ADMIN") {
        return true
    }

    // Must be same org for non-admin invites
    if (!isSameOrg) {
        return false
    }

    // ENTITY_ADMIN can invite ENTITY_USER to their org
    if (inviterRole === "ENTITY_ADMIN" && targetRole === "ENTITY_USER") {
        return true
    }

    // PROVIDER_ADMIN can invite PROVIDER_USER to their org
    if (inviterRole === "PROVIDER_ADMIN" && targetRole === "PROVIDER_USER") {
        return true
    }

    return false
}

/**
 * Get the dashboard path for a role
 */
export function getRoleDashboard(role: Role): string {
    if (role === "ADMIN") return "/admin/dashboard"
    if (role === "ENTITY_ADMIN" || role === "ENTITY_USER") return "/entity/dashboard"
    if (role === "PROVIDER_ADMIN" || role === "PROVIDER_USER") return "/provider/dashboard"
    return "/landing"
}

/**
 * Check if role is an admin (org or platform)
 */
export function isAdminRole(role: Role): boolean {
    return role === "ADMIN" || role === "ENTITY_ADMIN" || role === "PROVIDER_ADMIN"
}

/**
 * Get organization type from role
 */
export function getOrgTypeFromRole(role: Role): "entity" | "provider" | null {
    if (role === "ENTITY_ADMIN" || role === "ENTITY_USER") return "entity"
    if (role === "PROVIDER_ADMIN" || role === "PROVIDER_USER") return "provider"
    return null
}

/**
 * Validate that user can only see data from their org (tenancy check)
 */
export function validateTenancy(userOrgId: string, resourceOrgId: string, userRole: Role): boolean {
    // ADMIN can see everything
    if (userRole === "ADMIN") return true

    // All other users must match orgId
    return userOrgId === resourceOrgId
}
