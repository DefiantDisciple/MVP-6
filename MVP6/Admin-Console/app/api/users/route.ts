import { type NextRequest, NextResponse } from "next/server"
import type { User } from "@/lib/types"

const mockUsers: User[] = [
  {
    id: "USR-2024-001",
    name: "John Modise",
    email: "j.modise@transport.gov.bw",
    role: "entity",
    entityOrCompany: "Ministry of Transport",
    status: "active",
    lastActive: "2024-02-18",
  },
  {
    id: "USR-2024-002",
    name: "Sarah Kgosi",
    email: "s.kgosi@health.gov.bw",
    role: "entity",
    entityOrCompany: "Ministry of Health",
    status: "active",
    lastActive: "2024-02-17",
  },
  {
    id: "USR-2024-003",
    name: "Thabo Mogale",
    email: "t.mogale@medtech.co.bw",
    role: "provider",
    entityOrCompany: "MedTech Solutions Ltd",
    status: "active",
    lastActive: "2024-02-16",
  },
  {
    id: "USR-2024-004",
    name: "Keabetswe Seretse",
    email: "k.seretse@ppadb.gov.bw",
    role: "admin",
    entityOrCompany: "PPADB",
    status: "active",
    lastActive: "2024-02-18",
  },
  {
    id: "USR-2024-005",
    name: "David Tlou",
    email: "d.tlou@buildright.co.bw",
    role: "provider",
    entityOrCompany: "BuildRight Construction",
    status: "active",
    lastActive: "2024-02-15",
  },
  {
    id: "USR-2024-006",
    name: "Mpho Tau",
    email: "m.tau@suspended.co.bw",
    role: "provider",
    entityOrCompany: "Suspended Company Ltd",
    status: "suspended",
    lastActive: "2024-01-20",
  },
  {
    id: "USR-2024-007",
    name: "Lesego Moeng",
    email: "l.moeng@newprovider.co.bw",
    role: "provider",
    entityOrCompany: "New Provider Ltd",
    status: "pending",
    lastActive: "2024-02-10",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const role = searchParams.get("role")
  const status = searchParams.get("status")

  let filtered = mockUsers

  if (role && role !== "All") {
    filtered = filtered.filter((u) => u.role === role)
  }

  if (status && status !== "All") {
    filtered = filtered.filter((u) => u.status === status)
  }

  return NextResponse.json(filtered)
}
