import { type NextRequest, NextResponse } from "next/server"
import type { TenderTimeline } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tenderId = searchParams.get("tenderId")

  const mockTimeline: TenderTimeline = {
    tenderId: tenderId || "",
    events: [
      {
        id: "1",
        timestamp: "2024-01-15T09:00:00Z",
        event: "Tender Published",
        actor: "System",
      },
      {
        id: "2",
        timestamp: "2024-01-20T14:30:00Z",
        event: "First Submission Received",
        actor: "Provider_001",
      },
      {
        id: "3",
        timestamp: "2024-02-15T17:00:00Z",
        event: "Submissions Closed",
        actor: "System",
      },
      {
        id: "4",
        timestamp: "2024-02-16T10:00:00Z",
        event: "Technical Evaluation Started",
        actor: "Ministry of Transport",
      },
      {
        id: "5",
        timestamp: "2024-02-25T15:00:00Z",
        event: "Technical Lock Applied",
        actor: "System",
      },
      {
        id: "6",
        timestamp: "2024-02-26T11:00:00Z",
        event: "Preferred Bidder Set",
        actor: "Ministry of Transport",
      },
      {
        id: "7",
        timestamp: "2024-02-27T09:00:00Z",
        event: "Financial Proposals Unsealed",
        actor: "System",
      },
    ],
  }

  return NextResponse.json(mockTimeline)
}
