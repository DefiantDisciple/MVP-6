/**
 * In-memory data store for multi-tenant system
 * Replace with real database in production
 */

import { User, Organization, InviteToken, AuditLog } from "@/lib/types"
import { hashPassword } from "@/lib/auth/utils"

// In-memory stores
const users: Map<string, User> = new Map()
const organizations: Map<string, Organization> = new Map()
const inviteTokens: Map<string, InviteToken> = new Map()
const auditLogs: Map<string, AuditLog> = new Map()
const usersByEmail: Map<string, string> = new Map() // email -> userId

/**
 * Initialize with founder admin and demo organizations
 */
export function initializeStore() {
    // Create founder admin organization
    const adminOrg: Organization = {
        id: "org-admin-001",
        name: "VerDEX Platform Administration",
        type: "entity",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    organizations.set(adminOrg.id, adminOrg)

    // Create demo entity organization
    const demoEntityOrg: Organization = {
        id: "org-entity-demo",
        name: "Ministry of Infrastructure (Demo)",
        type: "entity",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    organizations.set(demoEntityOrg.id, demoEntityOrg)

    // Create demo provider organization
    const demoProviderOrg: Organization = {
        id: "org-provider-demo",
        name: "BuildCorp Services Ltd (Demo)",
        type: "provider",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    organizations.set(demoProviderOrg.id, demoProviderOrg)

    // Bootstrap founder admin from environment or use default
    const founderEmail = process.env.FOUNDER_EMAIL || "founder@verdex.systems"
    const founderPassword = process.env.FOUNDER_PASSWORD || "demo123"
    const founderPasswordHash = hashPassword(founderPassword)

    // Create founder admin user (only ADMIN in the system)
    const founderAdmin: User = {
        id: "user-founder-001",
        email: founderEmail,
        name: "Founder Admin",
        role: "ADMIN",
        orgId: adminOrg.id,
        authMethod: "both", // Can use both Classic and II
        passwordHash: founderPasswordHash,
        iiPrincipal: undefined, // Will be set when user links their II
        organizationName: adminOrg.name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    users.set(founderAdmin.id, founderAdmin)
    usersByEmail.set(founderAdmin.email, founderAdmin.id)

    // Create demo users for testing (demo dashboards)
    const demoPasswordHash = hashPassword("demo123")

    const demoEntity: User = {
        id: "user-entity-demo",
        email: "demo@entity.com",
        name: "Demo Entity Admin",
        role: "ENTITY_ADMIN",
        orgId: demoEntityOrg.id,
        authMethod: "classic",
        passwordHash: demoPasswordHash,
        organizationName: demoEntityOrg.name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    users.set(demoEntity.id, demoEntity)
    usersByEmail.set(demoEntity.email.toLowerCase(), demoEntity.id)

    const demoProvider: User = {
        id: "user-provider-demo",
        email: "demo@provider.com",
        name: "Demo Provider Admin",
        role: "PROVIDER_ADMIN",
        orgId: demoProviderOrg.id,
        authMethod: "classic",
        passwordHash: demoPasswordHash,
        organizationName: demoProviderOrg.name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    users.set(demoProvider.id, demoProvider)
    usersByEmail.set(demoProvider.email.toLowerCase(), demoProvider.id)
}

// Initialize on module load
initializeStore()

/**
 * User operations
 */
export const userStore = {
    findById(id: string): User | undefined {
        return users.get(id)
    },

    findByEmail(email: string): User | undefined {
        const userId = usersByEmail.get(email.toLowerCase())
        return userId ? users.get(userId) : undefined
    },

    findByIIPrincipal(principal: string): User | undefined {
        for (const user of users.values()) {
            if (user.iiPrincipal === principal) {
                return user
            }
        }
        return undefined
    },

    findByOrgId(orgId: string): User[] {
        return Array.from(users.values()).filter((u) => u.orgId === orgId)
    },

    create(user: User): User {
        users.set(user.id, user)
        usersByEmail.set(user.email, user.id)
        return user
    },

    update(id: string, updates: Partial<User>): User | undefined {
        const user = users.get(id)
        if (!user) return undefined

        const updatedUser = { ...user, ...updates, updatedAt: new Date() }
        users.set(id, updatedUser)

        // Update email index if email changed
        if (updates.email && updates.email !== user.email) {
            usersByEmail.delete(user.email)
            usersByEmail.set(updates.email, id)
        }

        return updatedUser
    },

    delete(id: string): boolean {
        const user = users.get(id)
        if (!user) return false

        usersByEmail.delete(user.email)
        return users.delete(id)
    },

    list(): User[] {
        return Array.from(users.values())
    },
}

/**
 * Organization operations
 */
export const orgStore = {
    findById(id: string): Organization | undefined {
        return organizations.get(id)
    },

    create(org: Organization): Organization {
        organizations.set(org.id, org)
        return org
    },

    update(id: string, updates: Partial<Organization>): Organization | undefined {
        const org = organizations.get(id)
        if (!org) return undefined

        const updated = { ...org, ...updates, updatedAt: new Date() }
        organizations.set(id, updated)
        return updated
    },

    list(): Organization[] {
        return Array.from(organizations.values())
    },
}

/**
 * Invite token operations
 */
export const inviteStore = {
    findByToken(token: string): InviteToken | undefined {
        return inviteTokens.get(token)
    },

    findByEmail(email: string): InviteToken[] {
        return Array.from(inviteTokens.values()).filter((inv) => inv.email.toLowerCase() === email.toLowerCase() && !inv.acceptedAt)
    },

    findPendingByEmail(email: string): InviteToken | undefined {
        const now = new Date()
        return Array.from(inviteTokens.values()).find(
            (inv) => inv.email.toLowerCase() === email.toLowerCase() && !inv.acceptedAt && inv.expiresAt > now
        )
    },

    create(invite: InviteToken): InviteToken {
        inviteTokens.set(invite.token, invite)
        return invite
    },

    markAsAccepted(token: string): InviteToken | undefined {
        const invite = inviteTokens.get(token)
        if (!invite) return undefined

        const accepted = { ...invite, acceptedAt: new Date() }
        inviteTokens.set(token, accepted)
        return accepted
    },

    list(): InviteToken[] {
        return Array.from(inviteTokens.values())
    },
}

/**
 * Audit log operations
 */
export const auditStore = {
    create(log: AuditLog): AuditLog {
        auditLogs.set(log.id, log)
        return log
    },

    list(limit: number = 100): AuditLog[] {
        const logs = Array.from(auditLogs.values())
        return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
    },

    findByUserId(userId: string, limit: number = 50): AuditLog[] {
        const logs = Array.from(auditLogs.values()).filter((log) => log.userId === userId)
        return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
    },
}

// Initialize the store when module is first imported
initializeStore()
