import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore, orgStore, inviteStore } from "@/lib/db/store"
import { generateInviteToken, generateInviteId, isValidEmail } from "@/lib/auth/utils"
import type { Role } from "@/lib/types"

/**
 * POST: Create new invite
 * Only Admin and Entity Org Admin can invite users
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get("user_id")?.value
        const userRole = cookieStore.get("user_role")?.value

        if (!userId || !userRole) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const currentUser = userStore.findById(userId)
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const body = await request.json()
        const { email, role, orgId, organizationName, organizationType } = body

        // Validate inputs
        if (!email || !role) {
            return NextResponse.json({ error: "Email and role are required" }, { status: 400 })
        }

        // Must have either orgId OR both organizationName and organizationType
        if (!orgId && (!organizationName || !organizationType)) {
            return NextResponse.json({
                error: "Either orgId or both organizationName and organizationType are required"
            }, { status: 400 })
        }

        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        // Permission checks
        if (currentUser.role !== "admin" && currentUser.role !== "entity") {
            return NextResponse.json({ error: "Only Admin and Entity users can invite" }, { status: 403 })
        }

        // Entity users can only invite to their own organization
        if (currentUser.role === "entity" && orgId && currentUser.orgId !== orgId) {
            return NextResponse.json({ error: "Cannot invite to other organizations" }, { status: 403 })
        }

        // Entity users cannot create new organizations
        if (currentUser.role === "entity" && organizationName) {
            return NextResponse.json({ error: "Only Admin can create new organizations" }, { status: 403 })
        }

        // Only Admin can assign Admin role
        if (role === "admin" && currentUser.role !== "admin") {
            return NextResponse.json({ error: "Only Admin can assign Admin role" }, { status: 403 })
        }

        // Check if user already exists
        const existingUser = userStore.findByEmail(email.toLowerCase())
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
        }

        // Handle organization - either get existing or create new
        let targetOrgId = orgId
        let org

        if (organizationName && organizationType) {
            // Create new organization
            org = orgStore.create({
                id: `org-${organizationType}-${Date.now()}`,
                name: organizationName,
                type: organizationType,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            targetOrgId = org.id
        } else {
            // Check if organization exists
            org = orgStore.findById(orgId)
            if (!org) {
                return NextResponse.json({ error: "Organization not found" }, { status: 404 })
            }
        }

        // Validate role matches organization type
        if (role === "provider" && org.type !== "provider") {
            return NextResponse.json({ error: "Cannot assign provider role to entity organization" }, { status: 400 })
        }
        if (role === "entity" && org.type !== "entity") {
            return NextResponse.json({ error: "Cannot assign entity role to provider organization" }, { status: 400 })
        }

        // Generate invite token
        const token = generateInviteToken()
        const invite = inviteStore.create({
            id: generateInviteId(),
            email: email.toLowerCase(),
            role: role as Role,
            orgId: targetOrgId,
            invitedBy: userId,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            isUsed: false,
            createdAt: new Date(),
        })

        // In production, send email with invite link
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/accept-invite?token=${token}`

        return NextResponse.json({
            success: true,
            invite: {
                id: invite.id,
                email: invite.email,
                role: invite.role,
                orgId: invite.orgId,
                organizationName: org.name,
                inviteLink, // Only for demo, remove in production
                expiresAt: invite.expiresAt,
            },
        })
    } catch (error) {
        console.error("[Auth] Invite error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * GET: List pending invites (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get("user_id")?.value
        const userRole = cookieStore.get("user_role")?.value

        if (!userId || userRole !== "admin") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 })
        }

        const invites = inviteStore.list()
            .map(inv => ({
                id: inv.id,
                email: inv.email,
                role: inv.role,
                orgId: inv.orgId,
                invitedBy: inv.invitedBy,
                token: inv.token,
                expiresAt: inv.expiresAt,
                isUsed: inv.isUsed,
                usedAt: inv.usedAt,
                createdAt: inv.createdAt,
            }))

        return NextResponse.json({ invites })
    } catch (error) {
        console.error("[Auth] List invites error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
