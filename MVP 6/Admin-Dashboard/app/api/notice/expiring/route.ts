import { NextResponse } from "next/server"

export async function GET() {
  // Mock data - standstill periods ending within 3 business days
  const data = {
    count: 3,
  }

  return NextResponse.json(data)
}
