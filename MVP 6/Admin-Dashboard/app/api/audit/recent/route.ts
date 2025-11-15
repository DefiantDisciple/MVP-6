import { NextResponse } from "next/server"

export async function GET() {
  // Mock data
  const data = {
    events: [
      {
        timestamp: "2025-01-11T09:15:00Z",
        actor: "procurement@gov.bw",
        event: "Award confirmed for T-2025-089",
      },
      {
        timestamp: "2025-01-11T08:42:00Z",
        actor: "evaluator@entity.bw",
        event: "Financial envelope unsealed",
      },
      {
        timestamp: "2025-01-10T16:30:00Z",
        actor: "system",
        event: "Technical evaluation locked",
      },
      {
        timestamp: "2025-01-10T14:20:00Z",
        actor: "admin@ppadb.bw",
        event: "User role changed: observer → evaluator",
      },
      {
        timestamp: "2025-01-10T11:05:00Z",
        actor: "provider@company.bw",
        event: "Bid submitted for T-2025-091",
      },
    ],
  }

  return NextResponse.json(data)
}
