import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, technicalHash, financialHash } = body

    // Mock: Update submission with new hashes
    const replacedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      submissionId,
      replacedAt,
      technicalHash,
      financialHash,
      receipts: [
        {
          documentType: "technical",
          sha256: technicalHash,
          uploadedAt: replacedAt,
          sealed: false,
        },
        {
          documentType: "financial",
          sha256: financialHash,
          uploadedAt: replacedAt,
          sealed: true,
        },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to replace submission" }, { status: 500 })
  }
}
