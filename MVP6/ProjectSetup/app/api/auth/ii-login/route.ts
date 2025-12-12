import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { userStore } from "@/lib/db/store"

/**
 * POST: Handle Internet Identity login
 * Links II principal to existing user or creates new user if invited
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { principal } = body

        if (!principal) {
            return NextResponse.json({ error: "Principal required" }, { status: 400 })
        }

        // Find user by II principal
        let user = userStore.findByIIPrincipal(principal)

        if (!user) {
            return NextResponse.json(
                {
                    error: "No account linked to this Internet Identity",
                    needsLinking: true,
                    principal
                },
                { status: 404 }
            )
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
        }

        // Set session cookies
        const cookieStore = await cookies()

        cookieStore.set("user_role", user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })

        cookieStore.set("user_id", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        cookieStore.set("org_id", user.orgId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })

        // Return safe user data
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                orgId: user.orgId,
                organizationName: user.organizationName,
                authMethod: user.authMethod,
            },
        })
    } catch (error) {
        console.error("[Auth] II Login error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
