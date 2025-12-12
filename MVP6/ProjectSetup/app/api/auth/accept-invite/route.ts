import { type NextRequest, NextResponse } from "next/server"
import { userStore, inviteStore, orgStore } from "@/lib/db/store"
import { hashPassword, generateUserId, isValidPassword } from "@/lib/auth/utils"

/**
 * POST: Accept invite and create user account
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, name, password } = body

        // Validate inputs
        if (!token || !name || !password) {
            return NextResponse.json({ error: "Token, name, and password required" }, { status: 400 })
        }

        if (!isValidPassword(password)) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
        }

        // Find invite
        const invite = inviteStore.findByToken(token)
        if (!invite) {
            return NextResponse.json({ error: "Invalid invite token" }, { status: 404 })
        }

        // Check if invite is used
        if (invite.isUsed) {
            return NextResponse.json({ error: "Invite already used" }, { status: 400 })
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

        // Create user
        const user = userStore.create({
            id: generateUserId(),
            email: invite.email,
            name,
            role: invite.role,
            orgId: invite.orgId,
            authMethod: "classic",
            passwordHash: hashPassword(password),
            organizationName: org.name,
            isActive: true,
            invitedBy: invite.invitedBy,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // Mark invite as used
        inviteStore.markAsUsed(token)

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

        if (invite.isUsed) {
            return NextResponse.json({ error: "Invite already used" }, { status: 400 })
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
