/**
 * In-memory data store for multi-tenant system
 * Replace with real database in production
 */

import { User, Organization, InviteToken } from "@/lib/types"

// In-memory stores
const users: Map<string, User> = new Map()
const organizations: Map<string, Organization> = new Map()
const inviteTokens: Map<string, InviteToken> = new Map()
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

    // Hash for "demo123" password
    // In production, use bcrypt. For demo: crypto sha256 hash of "demo123"
    const demoPasswordHash = "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"

    // Create founder admin user
    const founderAdmin: User = {
        id: "user-founder-001",
        email: "founder@verdex.systems",
        name: "Founder Admin",
        role: "admin",
        orgId: adminOrg.id,
        authMethod: "both", // Can use both Classic and II
        passwordHash: demoPasswordHash, // Password: demo123
        organizationName: adminOrg.name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    users.set(founderAdmin.id, founderAdmin)
    usersByEmail.set(founderAdmin.email, founderAdmin.id)

    // Create demo users for testing (will only see demo data)
    const demoEntity: User = {
        id: "user-entity-demo",
        email: "demo@entity.com",
        name: "Demo Entity User",
        role: "entity",
        orgId: demoEntityOrg.id,
        authMethod: "classic",
        passwordHash: demoPasswordHash, // Password: demo123
        organizationName: demoEntityOrg.name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    users.set(demoEntity.id, demoEntity)
    usersByEmail.set(demoEntity.email, demoEntity.id)

    const demoProvider: User = {
        id: "user-provider-demo",
        email: "demo@provider.com",
        name: "Demo Provider User",
        role: "provider",
        orgId: demoProviderOrg.id,
        authMethod: "classic",
        passwordHash: demoPasswordHash, // Password: demo123
        organizationName: demoProviderOrg.name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    users.set(demoProvider.id, demoProvider)
    usersByEmail.set(demoProvider.email, demoProvider.id)
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
        const userId = usersByEmail.get(email)
        return userId ? users.get(userId) : undefined
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

        const updated = { ...user, ...updates, updatedAt: new Date() }
        users.set(id, updated)
        return updated
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
        return Array.from(inviteTokens.values()).filter((inv) => inv.email === email && !inv.isUsed)
    },

    create(invite: InviteToken): InviteToken {
        inviteTokens.set(invite.token, invite)
        return invite
    },

    markAsUsed(token: string): InviteToken | undefined {
        const invite = inviteTokens.get(token)
        if (!invite) return undefined

        invite.isUsed = true
        invite.usedAt = new Date()
        inviteTokens.set(token, invite)
        return invite
    },

    list(): InviteToken[] {
        return Array.from(inviteTokens.values())
    },
}
