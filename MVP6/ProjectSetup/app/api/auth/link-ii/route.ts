import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore } from "@/lib/db/store"

/**
 * POST: Link Internet Identity to existing user account
 * User must be logged in with classic auth first
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userId = cookieStore.get("user_id")?.value

        if (!userId) {
            return NextResponse.json({ error: "Must be logged in to link II" }, { status: 401 })
        }

        const body = await request.json()
        const { principal } = body

        if (!principal) {
            return NextResponse.json({ error: "Principal required" }, { status: 400 })
        }

        // Get current user
        const user = userStore.findById(userId)
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Check if this principal is already linked to another account
        const existingUser = userStore.findByIIPrincipal(principal)
        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json(
                { error: "This Internet Identity is already linked to another account" },
                { status: 409 }
            )
        }

        // Link the principal
        const updatedUser = {
            ...user,
            iiPrincipal: principal,
            authMethod: "both" as const, // Now supports both auth methods
            updatedAt: new Date(),
        }

        userStore.update(userId, updatedUser)

        return NextResponse.json({
            success: true,
            message: "Internet Identity linked successfully",
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                authMethod: updatedUser.authMethod,
            },
        })
    } catch (error) {
        console.error("[Auth] Link II error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
