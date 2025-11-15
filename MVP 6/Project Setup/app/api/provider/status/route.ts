import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId") || "provider-1"

    // Mock provider KYB status data
    const providerStatus = {
      kyb: {
        status: "verified",
        statusText: "Verified",
        updatedDate: "2024-03-15T10:30:00Z",
        expiryDate: "2025-03-15T10:30:00Z",
        complianceScore: 96,
        documents: {
          businessRegistration: { status: "approved", uploadedDate: "2024-03-10T14:20:00Z" },
          taxClearance: { status: "approved", uploadedDate: "2024-03-12T09:15:00Z" },
          bankStatement: { status: "approved", uploadedDate: "2024-03-14T16:45:00Z" },
          directorIds: { status: "approved", uploadedDate: "2024-03-08T11:30:00Z" }
        },
        verificationBadge: {
          level: "Gold",
          issuedDate: "2024-03-15T10:30:00Z",
          validUntil: "2025-03-15T10:30:00Z"
        }
      },
      profile: {
        companyName: "BuildCorp Services Ltd",
        registrationNumber: "BW-REG-2019-4567",
        taxNumber: "TAX-789-456-123",
        category: "Construction & Engineering",
        establishedYear: 2019,
        employeeCount: 45,
        annualTurnover: 12500000,
        lastUpdated: "2024-11-10T08:00:00Z"
      }
    }

    return NextResponse.json({ 
      success: true,
      status: providerStatus 
    })

  } catch (error) {
    console.error("[v0] Get provider status error:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
