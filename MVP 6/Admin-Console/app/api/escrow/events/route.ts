import { NextResponse } from "next/server"
import type { EscrowEvent } from "@/lib/types"

const mockEvents: EscrowEvent[] = [
  {
    id: "ESC-001",
    timestamp: "2024-02-10T14:30:00Z",
    project: "School Building Construction - Gaborone",
    milestone: "Foundation Completion",
    signaturesComplete: 3,
    signaturesRequired: 3,
    event: "Auto-released",
    hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385",
  },
  {
    id: "ESC-002",
    timestamp: "2024-02-08T11:00:00Z",
    project: "Water Pipeline Installation",
    milestone: "Phase 1 Completion",
    signaturesComplete: 2,
    signaturesRequired: 3,
    event: "Pending Signatures",
    hash: "0x3c2c2eb7b11a91385f8ba942b568fd37b5eadcb923c92ef0c0c4f9f9f9f9f9f9",
  },
  {
    id: "ESC-003",
    timestamp: "2024-02-05T09:15:00Z",
    project: "IT Infrastructure Upgrade",
    milestone: "Hardware Delivery",
    signaturesComplete: 3,
    signaturesRequired: 3,
    event: "Auto-released",
    hash: "0xab4ead7c2c2eb7b11a91385f8ba942b568fd37b5eadcb923c92ef0c0c4f9fade",
  },
  {
    id: "ESC-004",
    timestamp: "2024-01-30T16:45:00Z",
    project: "Solar Panel Installation - Rural Areas",
    milestone: "Installation Complete",
    signaturesComplete: 3,
    signaturesRequired: 3,
    event: "Auto-released",
    hash: "0x8ba942b568fd37b5eadcb923c92ef0c0c4f9fade1c0d57a7af66ab4ead7c2c2e",
  },
  {
    id: "ESC-005",
    timestamp: "2024-01-28T13:20:00Z",
    project: "Road Maintenance Services - Northern District",
    milestone: "Equipment Mobilization",
    signaturesComplete: 3,
    signaturesRequired: 3,
    event: "Auto-released",
    hash: "0x2b568fd37b5eadcb923c92ef0c0c4f9fade1c0d57a7af66ab4ead7c2c2eb7b11",
  },
]

export async function GET() {
  return NextResponse.json(mockEvents)
}
