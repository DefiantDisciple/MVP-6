import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    committed: 2450000,
    released: 8920000,
    pendingRelease: 540000,
    lastAutoRelease: "2025-01-08T10:30:00Z",
  }

  return NextResponse.json(data)
}
