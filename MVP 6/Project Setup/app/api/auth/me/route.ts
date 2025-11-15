import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database (same as login route)
const mockUsers: Record<string, any> = {
  "entity-1": {
    id: "entity-1",
    email: "demo@entity.com",
    name: "Ministry of Infrastructure",
    role: "entity",
    organizationName: "Ministry of Infrastructure",
    phone: "+267 123 4567",
    address: "Government Enclave, Gaborone",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
  "provider-1": {
    id: "provider-1",
    email: "demo@provider.com",
    name: "BuildCorp Services",
    role: "provider",
    organizationName: "BuildCorp Services Ltd",
    phone: "+267 234 5678",
    address: "Plot 123, Industrial Area, Gaborone",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  },
  "admin-1": {
    id: "admin-1",
    email: "demo@admin.com",
    name: "System Administrator",
    role: "admin",
    organizationName: "TenderHub Platform",
    phone: "+267 345 6789",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date(),
  },
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value
    const userRole = cookieStore.get("user_role")?.value

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = mockUsers[userId]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
