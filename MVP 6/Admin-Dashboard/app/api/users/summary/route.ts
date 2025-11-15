import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    totalUsers: 1247,
    entities: 89,
    providers: 1142,
    admins: 16,
  }

  return NextResponse.json(data)
}
