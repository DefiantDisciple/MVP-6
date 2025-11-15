import { type NextRequest, NextResponse } from "next/server"
import { mockEvaluations } from "@/lib/mock-data"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value

    if (userRole !== "entity") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()

    const newEvaluation = {
      id: `eval-${Date.now()}`,
      tenderId: body.tenderId,
      bidId: body.bidId,
      evaluatorId: userId!,
      evaluatorName: body.evaluatorName,
      technicalScore: body.technicalScore,
      technicalMaxScore: body.technicalMaxScore || 100,
      financialScore: body.financialScore,
      financialMaxScore: body.financialMaxScore || 100,
      criteria: body.criteria || [],
      overallComments: body.overallComments,
      recommendation: body.recommendation,
      evaluatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockEvaluations.push(newEvaluation)

    return NextResponse.json({ evaluation: newEvaluation }, { status: 201 })
  } catch (error) {
    console.error("[v0] Save evaluation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
