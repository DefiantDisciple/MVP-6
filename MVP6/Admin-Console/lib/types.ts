// Shared type definitions for the admin console

export type TenderStage = "Open" | "Evaluation" | "Notice" | "Awarded" | "Active" | "Closed"

export type DisputeStatus = "Pending" | "Under Review" | "Resolved - Upheld" | "Resolved - Rejected"

export type UserRole = "entity" | "provider" | "admin"

export type UserStatus = "active" | "suspended" | "pending"

export interface Tender {
  id: string
  title: string
  entity: string
  stage: TenderStage
  postedDate: string
  closesDate?: string
  standstillDate?: string
  submissions: number
  status: string
  anomalies?: string[]
}

export interface TenderTimeline {
  tenderId: string
  events: {
    id: string
    timestamp: string
    event: string
    actor: string
  }[]
}

export interface Dispute {
  id: string
  tenderId: string
  tenderTitle: string
  provider: string
  filedOn: string
  status: DisputeStatus
  slaRemaining: number
  reason?: string
  attachments?: string[]
}

export interface EscrowSummary {
  committed: number
  released: number
  pendingRelease: number
}

export interface EscrowEvent {
  id: string
  timestamp: string
  project: string
  milestone: string
  signaturesComplete: number
  signaturesRequired: number
  event: string
  hash: string
}

export interface AuditLog {
  id: string
  timestamp: string
  actor: string
  event: string
  ref: string
  refType: "Tender" | "Case" | "User"
  hash: string
  payload?: Record<string, any>
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  entityOrCompany: string
  status: UserStatus
  lastActive: string
}
