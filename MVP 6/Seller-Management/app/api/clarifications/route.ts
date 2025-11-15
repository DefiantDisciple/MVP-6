import { type NextRequest, NextResponse } from "next/server"
import type { Clarification } from "@/types/tender"

const mockClarifications: Clarification[] = [
  {
    id: "CLR-001",
    tenderId: "TND-001",
    question: "What is the expected timeline for Phase 1 completion?",
    answer: "Phase 1 is expected to be completed within 6 months from contract signing.",
    askedBy: "PROV-123",
    askedAt: "2025-01-18T10:30:00Z",
    answeredAt: "2025-01-19T14:00:00Z",
  },
  {
    id: "CLR-002",
    tenderId: "TND-001",
    question: "Are there any environmental clearances required?",
    askedBy: "PROV-456",
    askedAt: "2025-01-19T09:15:00Z",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tenderId = searchParams.get("tid")

  if (tenderId) {
    return NextResponse.json(mockClarifications.filter((c) => c.tenderId === tenderId))
  }

  return NextResponse.json(mockClarifications)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenderId, question, askedBy } = body

    const clarification: Clarification = {
      id: `CLR-${Date.now()}`,
      tenderId,
      question,
      askedBy,
      askedAt: new Date().toISOString(),
    }

    mockClarifications.push(clarification)

    return NextResponse.json(clarification)
  } catch (error) {
    return NextResponse.json({ error: "Failed to post clarification" }, { status: 500 })
  }
}
