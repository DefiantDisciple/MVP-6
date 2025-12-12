/**
 * Session management for multi-tenant authentication
 * Handles both Classic Auth and Internet Identity
 */

import { User } from "@/lib/types"

export interface SessionData {
    userId: string
    email: string
    role: string
    orgId: string
    authMethod: string
    iiPrincipal?: string
}

/**
 * Create session data from user object
 * Strips sensitive fields (passwordHash)
 */
export function createSessionData(user: User): SessionData {
    return {
        userId: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
        authMethod: user.authMethod,
        iiPrincipal: user.iiPrincipal,
    }
}

/**
 * Validate session data structure
 */
export function isValidSession(data: any): data is SessionData {
    return (
        typeof data === "object" &&
        typeof data.userId === "string" &&
        typeof data.email === "string" &&
        typeof data.role === "string" &&
        typeof data.orgId === "string" &&
        typeof data.authMethod === "string"
    )
}

/**
 * Check if user has permission to access a route
 */
export function hasRoutePermission(session: SessionData, pathname: string): boolean {
    const role = session.role

    if (pathname.startsWith("/admin")) {
        return role === "admin"
    } else if (pathname.startsWith("/entity")) {
        return role === "entity" || role === "admin"
    } else if (pathname.startsWith("/provider")) {
        return role === "provider" || role === "admin"
    }

    return true
}

/**
 * Get role-based redirect URL
 */
export function getRoleRedirect(role: string): string {
    switch (role) {
        case "entity":
            return "/entity/dashboard"
        case "provider":
            return "/provider/dashboard"
        case "admin":
            return "/admin/dashboard"
        default:
            return "/login"
    }
}
