import { NextResponse } from "next/server"

const mockPendingRequests = [
  {
    id: "REQ-001",
    userId: "USR-2024-007",
    userName: "Lesego Moeng",
    requestType: "reactivation",
    requestedAt: "2024-02-15",
  },
  {
    id: "REQ-002",
    userId: "USR-2024-003",
    userName: "Thabo Mogale",
    requestType: "role_change",
    currentRole: "provider",
    requestedRole: "entity",
    requestedAt: "2024-02-12",
  },
]

export async function GET() {
  return NextResponse.json(mockPendingRequests)
}
