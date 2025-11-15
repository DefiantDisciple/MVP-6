import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get("entityId") || "entity-1"

    // Mock entity profile data
    const entityProfile = {
      id: entityId,
      name: "Ministry of Infrastructure Development",
      type: "Government Ministry",
      code: "MID-2024-001",
      officer: {
        name: "Dr. Thabo Mokoena",
        email: "t.mokoena@infrastructure.gov.bw",
        position: "Chief Procurement Officer"
      },
      verification: {
        isVerified: true,
        verifiedDate: "2024-01-15T00:00:00Z",
        badgeLevel: "Gold"
      },
      procurementThreshold: 50000000, // P50M
      lastUpdated: "2024-11-10T14:30:00Z",
      address: {
        street: "Government Enclave, Plot 54365",
        city: "Gaborone",
        country: "Botswana",
        postalCode: "Private Bag 007"
      },
      contact: {
        phone: "+267 395 4000",
        fax: "+267 395 4001",
        website: "www.infrastructure.gov.bw"
      },
      establishedDate: "1966-09-30T00:00:00Z",
      registrationNumber: "GOV-MIN-001"
    }

    return NextResponse.json({ profile: entityProfile })
  } catch (error) {
    console.error("[v0] Get entity profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
