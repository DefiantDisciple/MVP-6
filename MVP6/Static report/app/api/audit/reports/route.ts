import { NextResponse } from "next/server"

// Mock audit verification data
const auditRecords: Record<string, boolean> = {
  "0x9a2f8e7c3d1b5a9e4f2c8d6b1a3e5f7c9b2d4e6a8c1f3e5d7b9a2c4e6f8a1c3e5": true,
  "0x8cf7a2d5e1b9c3f6a4d8e2b7c5f1a9d3e6b8c2f4a7d1e5b9c3f6a8d2e4b7c1f5": true,
  "0x7be6c1f4a8d2e5b9c3f7a1d4e8b2c6f9a3d5e7b1c4f6a9d2e5c8b1f4a7d3e6c9": true,
  "0x6ad5b2e3f7c1a9d4e6b8c2f5a7d1e4b9c3f6a8d2e5b7c1f4a9d3e6c8b2f5a7d1": true,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const hash = searchParams.get("hash")

  if (!hash) {
    return NextResponse.json({ error: "Hash parameter required" }, { status: 400 })
  }

  const verified = auditRecords[hash] || false

  return NextResponse.json({
    verified,
    hash,
    timestamp: new Date().toISOString(),
  })
}
