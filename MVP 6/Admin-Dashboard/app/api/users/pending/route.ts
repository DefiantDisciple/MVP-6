import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    roleChangeRequests: 5,
    suspended: 2,
  }

  return NextResponse.json(data)
}
