import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { orgStore } from "@/lib/db/store"

/**
 * GET: List all organizations (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userRole = cookieStore.get("user_role")?.value

        // Only admins can list all organizations
        if (userRole !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const organizations = orgStore.list()

        return NextResponse.json({
            organizations: organizations.map((org: any) => ({
                id: org.id,
                name: org.name,
                type: org.type,
                createdAt: org.createdAt,
            })),
        })
    } catch (error) {
        console.error("[API] Get organizations error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * POST: Create a new organization (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const userRole = cookieStore.get("user_role")?.value

        // Only admins can create organizations
        if (userRole !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const body = await request.json()
        const { name, type } = body

        if (!name || !type) {
            return NextResponse.json(
                { error: "Organization name and type are required" },
                { status: 400 }
            )
        }

        if (!["entity", "provider"].includes(type)) {
            return NextResponse.json(
                { error: "Type must be 'entity' or 'provider'" },
                { status: 400 }
            )
        }

        // Create the organization
        const newOrg = orgStore.create({
            id: `org-${type}-${Date.now()}`,
            name,
            type,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        return NextResponse.json({
            success: true,
            organization: newOrg,
        })
    } catch (error) {
        console.error("[API] Create organization error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
