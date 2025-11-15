import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    open: 24,
    evaluation: 8,
    noticeToAward: 5,
    awarded: 12,
    active: 45,
    closed: 238,
  }

  return NextResponse.json(data)
}
