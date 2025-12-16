import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore, inviteStore, orgStore, auditStore } from "@/lib/db/store"
import { hashPassword, generateUserId, isValidPassword } from "@/lib/auth/utils"
import { getRoleDashboard } from "@/lib/auth/permissions"

/**
 * POST: Accept invite and create user account
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, name, password, iiPrincipal } = body

        // Validate inputs
        if (!token || !name) {
            return NextResponse.json({ error: "Token and name required" }, { status: 400 })
        }

        // Must have either password or II principal
        if (!password && !iiPrincipal) {
            return NextResponse.json({ error: "Either password or Internet Identity required" }, { status: 400 })
        }

        // Validate password if provided
        if (password && !isValidPassword(password)) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
        }

        // Check if II principal is already linked to another account
        if (iiPrincipal) {
            const existingUser = userStore.findByIIPrincipal(iiPrincipal)
            if (existingUser) {
                return NextResponse.json(
                    { error: "This Internet Identity is already linked to another account" },
                    { status: 409 }
                )
            }
        }

        // Find invite
        const invite = inviteStore.findByToken(token)
        if (!invite) {
            return NextResponse.json({ error: "Invalid invite token" }, { status: 404 })
        }

        // Check if invite is already accepted
        if (invite.acceptedAt) {
            return NextResponse.json({ error: "Invite already accepted" }, { status: 400 })
        }

        // Check if invite is expired
        if (invite.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invite has expired" }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = userStore.findByEmail(invite.email)
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 })
        }

        // Get organization
        const org = orgStore.findById(invite.orgId)
        if (!org) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 })
        }

        // Determine auth method
        let authMethod: "classic" | "ii" | "both" = "classic"
        if (password && iiPrincipal) {
            authMethod = "both"
        } else if (iiPrincipal) {
            authMethod = "ii"
        }

        // Create user
        const user = userStore.create({
            id: generateUserId(),
            email: invite.email,
            name,
            role: invite.role,
            orgId: invite.orgId,
            authMethod,
            passwordHash: password ? hashPassword(password) : undefined,
            iiPrincipal: iiPrincipal || undefined,
            organizationName: org.name,
            isActive: true,
            invitedBy: invite.invitedBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // Mark invite as accepted
        inviteStore.markAsAccepted(token)

        // Log audit event
        auditStore.create({
            id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            userEmail: user.email,
            action: "invite_accepted",
            details: `User accepted invitation and created account with role ${user.role}`,
            timestamp: new Date(),
        })

        // Create session
        const cookieStore = await cookies()
        cookieStore.set("user_id", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        cookieStore.set("user_role", user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        })
        cookieStore.set("org_id", user.orgId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        })

        // Update last login
        userStore.update(user.id, { lastLoginAt: new Date() })

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                orgId: user.orgId,
                organizationName: user.organizationName,
            },
            redirectUrl: getRoleDashboard(user.role),
        })
    } catch (error) {
        console.error("[Auth] Accept invite error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * GET: Verify invite token
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.json({ error: "Token required" }, { status: 400 })
        }

        const invite = inviteStore.findByToken(token)
        if (!invite) {
            return NextResponse.json({ error: "Invalid invite token" }, { status: 404 })
        }

        // Check if already accepted
        if (invite.acceptedAt) {
            return NextResponse.json({ error: "Invite already accepted" }, { status: 400 })
        }

        if (invite.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invite has expired" }, { status: 400 })
        }

        const org = orgStore.findById(invite.orgId)

        return NextResponse.json({
            valid: true,
            invite: {
                email: invite.email,
                role: invite.role,
                organizationName: org?.name || "Unknown",
                expiresAt: invite.expiresAt,
            },
        })
    } catch (error) {
        console.error("[Auth] Verify invite error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
