import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore, orgStore, inviteStore, auditStore } from "@/lib/db/store"
import { generateInviteToken, generateInviteId, isValidEmail } from "@/lib/auth/utils"
import { canInviteRole, getOrgTypeFromRole } from "@/lib/auth/permissions"
import { sendInviteEmail } from "@/lib/email/resend"
import { Role } from "@/lib/types"

/**
 * POST /api/invites/create
 * Create and send an invitation
 */
export async function POST(request: NextRequest) {
    try {
        // Get authenticated user from session
        const cookieStore = await cookies()
        const userId = cookieStore.get("user_id")?.value
        const userRole = cookieStore.get("user_role")?.value as Role | undefined
        const userOrgId = cookieStore.get("org_id")?.value

        if (!userId || !userRole || !userOrgId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const inviter = userStore.findById(userId)
        if (!inviter || !inviter.isActive) {
            return NextResponse.json({ error: "Invalid user session" }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const {
            email,
            role,
            orgId,
            orgName, // For creating new organization
            orgType, // For creating new organization
        } = body

        // Validate email
        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
        }

        // Validate role
        const validRoles: Role[] = ["ADMIN", "ENTITY_ADMIN", "ENTITY_USER", "PROVIDER_ADMIN", "PROVIDER_USER"]
        if (!role || !validRoles.includes(role)) {
            return NextResponse.json({ error: "Valid role is required" }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = userStore.findByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { error: "A user with this email already exists" },
                { status: 409 }
            )
        }

        // Check if there's already a pending invite
        const pendingInvite = inviteStore.findPendingByEmail(email)
        if (pendingInvite) {
            return NextResponse.json(
                { error: "A pending invitation already exists for this email" },
                { status: 409 }
            )
        }

        // Determine target organization
        let targetOrgId = orgId
        let targetOrgName = ""

        if (targetOrgId) {
            // Using existing organization
            const targetOrg = orgStore.findById(targetOrgId)
            if (!targetOrg) {
                return NextResponse.json({ error: "Organization not found" }, { status: 404 })
            }
            targetOrgName = targetOrg.name

            // Verify org type matches role
            const roleOrgType = getOrgTypeFromRole(role)
            if (roleOrgType && targetOrg.type !== roleOrgType) {
                return NextResponse.json(
                    { error: `Role ${role} cannot be assigned to a ${targetOrg.type} organization` },
                    { status: 400 }
                )
            }
        } else if (orgName && orgType) {
            // Creating new organization (ADMIN only)
            if (userRole !== "ADMIN") {
                return NextResponse.json(
                    { error: "Only platform administrators can create new organizations" },
                    { status: 403 }
                )
            }

            // Validate org type
            if (orgType !== "entity" && orgType !== "provider") {
                return NextResponse.json({ error: "Organization type must be 'entity' or 'provider'" }, { status: 400 })
            }

            // Verify org type matches role
            const roleOrgType = getOrgTypeFromRole(role)
            if (roleOrgType && orgType !== roleOrgType) {
                return NextResponse.json(
                    { error: `Role ${role} cannot be assigned to a ${orgType} organization` },
                    { status: 400 }
                )
            }

            // Create new organization
            const newOrg = orgStore.create({
                id: `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: orgName,
                type: orgType,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            targetOrgId = newOrg.id
            targetOrgName = newOrg.name
        } else {
            return NextResponse.json(
                { error: "Either orgId or both orgName and orgType must be provided" },
                { status: 400 }
            )
        }

        // Check permissions
        const isSameOrg = targetOrgId === userOrgId
        if (!canInviteRole(userRole, role, isSameOrg)) {
            return NextResponse.json(
                { error: "You do not have permission to invite users with this role" },
                { status: 403 }
            )
        }

        // Generate secure invite token
        const token = generateInviteToken()
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours

        // Create invite record
        const invite = inviteStore.create({
            id: generateInviteId(),
            email: email.toLowerCase(),
            role,
            orgId: targetOrgId,
            invitedBy: userId,
            token,
            expiresAt,
            createdAt: new Date(),
        })

        // Send email via Resend
        const emailResult = await sendInviteEmail({
            toEmail: email,
            toName: email.split("@")[0], // Use email prefix as name
            organizationName: targetOrgName,
            role: role,
            inviteToken: token,
            expiresInHours: 48,
            invitedByName: inviter.name,
        })

        if (!emailResult.success) {
            // Log warning but don't fail the invite creation
            console.warn("[Invite] Email send failed:", emailResult.error)

            // Still return success with warning
            return NextResponse.json({
                success: true,
                invite: {
                    id: invite.id,
                    email: invite.email,
                    role: invite.role,
                    expiresAt: invite.expiresAt,
                },
                warning: "Invite created but email delivery failed. Share the invite link manually.",
                inviteLink: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/accept-invite?token=${token}`,
            })
        }

        // Log audit event
        auditStore.create({
            id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: inviter.id,
            userEmail: inviter.email,
            action: "invite_created",
            details: `Invited ${email} as ${role} to organization ${targetOrgName}`,
            timestamp: new Date(),
        })

        return NextResponse.json({
            success: true,
            invite: {
                id: invite.id,
                email: invite.email,
                role: invite.role,
                expiresAt: invite.expiresAt,
            },
        })
    } catch (error: any) {
        console.error("[Invite Create] Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create invitation" },
            { status: 500 }
        )
    }
}
