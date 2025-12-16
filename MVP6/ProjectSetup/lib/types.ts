// Core role definition - Production roles with granular permissions
export type Role = "ADMIN" | "ENTITY_ADMIN" | "ENTITY_USER" | "PROVIDER_ADMIN" | "PROVIDER_USER"

// Authentication method
export type AuthMethod = "classic" | "ii" | "both"

// Organization type
export type OrganizationType = "entity" | "provider"

// Organization
export interface Organization {
  id: string
  name: string
  type: OrganizationType
  createdAt: Date
  updatedAt: Date
}

// Tender stage lifecycle
export type TenderStage =
  | "draft"
  | "published"
  | "clarification"
  | "submission"
  | "evaluation"
  | "awarded"
  | "disputed"
  | "completed"
  | "cancelled"

// User (Multi-tenant with dual auth)
export interface User {
  id: string
  email: string
  name: string
  role: Role
  orgId: string // Organization ID (required for multi-tenancy)
  authMethod: AuthMethod // Authentication method used
  iiPrincipal?: string // Internet Identity principal (nullable)
  passwordHash?: string // For classic auth (never exposed to client)
  organizationName?: string // Denormalized for display
  phone?: string
  address?: string
  isActive: boolean // Account status
  invitedBy?: string // User ID who sent the invite
  lastLoginAt?: Date // Last successful login timestamp
  createdAt: Date
  updatedAt: Date
}

// Invite token for onboarding
export interface InviteToken {
  id: string
  email: string
  role: Role
  orgId: string
  invitedBy: string // User ID who created the invite
  token: string // Secure random token (hashed at rest recommended)
  expiresAt: Date
  acceptedAt?: Date // When invite was accepted (replaces isUsed/usedAt)
  createdAt: Date
}

// Audit log for security events
export interface AuditLog {
  id: string
  userId?: string // May be null for failed login attempts
  userEmail?: string
  action: "invite_created" | "invite_accepted" | "login_success" | "login_failure" | "role_changed" | "user_deactivated" | "user_activated"
  details: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

// Tender
export interface Tender {
  id: string
  entityId: string
  title: string
  description: string
  category: string
  budget: number
  currency: string
  stage: TenderStage

  // Timeline (business days)
  publishedAt?: Date
  clarificationDeadline?: Date
  submissionDeadline: Date
  evaluationDeadline?: Date
  awardDeadline?: Date

  // Documents
  documentUrls: string[]
  requirements: string[]

  // Status flags
  isSealed: boolean
  allowClarifications: boolean
  allowResubmissions: boolean

  createdAt: Date
  updatedAt: Date
}

// Vendor bid/submission
export interface VendorBid {
  id: string
  tenderId: string
  providerId: string
  providerName: string

  // Exactly 2 PDFs required
  technicalProposalUrl: string
  financialProposalUrl: string
  technicalProposalHash: string
  financialProposalHash: string

  // Submission metadata
  submittedAt: Date
  isWithdrawn: boolean
  withdrawnAt?: Date
  replacedAt?: Date
  version: number

  // Evaluation results
  technicalScore?: number
  financialScore?: number
  totalScore?: number
  isPreferred?: boolean

  createdAt: Date
  updatedAt: Date
}

// Clarification request/response
export interface Clarification {
  id: string
  tenderId: string
  providerId?: string
  providerName?: string

  question: string
  answer?: string

  isPublic: boolean
  askedAt: Date
  answeredAt?: Date

  createdAt: Date
  updatedAt: Date
}

// Evaluation criteria and scoring
export interface Evaluation {
  id: string
  tenderId: string
  bidId: string
  evaluatorId: string
  evaluatorName: string

  // Scoring
  technicalScore: number
  technicalMaxScore: number
  financialScore: number
  financialMaxScore: number

  // Criteria breakdown
  criteria: {
    name: string
    score: number
    maxScore: number
    comments?: string
  }[]

  overallComments?: string
  recommendation?: "award" | "reject" | "reconsider"

  evaluatedAt: Date
  createdAt: Date
  updatedAt: Date
}

// Notice to award
export interface NoticeToAward {
  id: string
  tenderId: string
  bidId: string
  providerId: string

  awardAmount: number
  awardDate: Date
  contractStartDate: Date
  contractEndDate: Date

  // Contract terms
  termsUrl?: string
  specialConditions?: string[]

  // Acceptance
  isAccepted?: boolean
  acceptedAt?: Date

  createdAt: Date
  updatedAt: Date
}

// Dispute
export interface Dispute {
  id: string
  tenderId: string
  providerId: string
  providerName: string

  reason: string
  details: string
  evidenceUrls: string[]

  status: "pending" | "under_review" | "resolved" | "rejected"

  // Resolution
  reviewedBy?: string
  resolution?: string
  resolvedAt?: Date

  filedAt: Date
  createdAt: Date
  updatedAt: Date
}

// Milestone for escrow tracking
export interface Milestone {
  id: string
  tenderId: string
  noticeToAwardId: string

  title: string
  description: string
  amount: number
  sequence: number

  // Timeline
  dueDate: Date

  // Status
  status: "pending" | "in_progress" | "submitted" | "approved" | "paid" | "disputed"

  // Deliverables
  deliverableUrls: string[]
  submittedAt?: Date
  approvedAt?: Date
  paidAt?: Date

  createdAt: Date
  updatedAt: Date
}

// Digital signature
export interface Signature {
  id: string
  documentId: string
  documentType: "tender" | "bid" | "award" | "milestone"

  signerId: string
  signerName: string
  signerRole: Role

  signatureHash: string
  ipAddress: string
  timestamp: Date

  createdAt: Date
}

// Escrow event log
export interface EscrowEvent {
  id: string
  tenderId: string
  milestoneId?: string

  type: "deposit" | "hold" | "release" | "refund" | "dispute"
  amount: number
  balance: number

  description: string
  performedBy: string
  performedByRole: Role

  timestamp: Date
  createdAt: Date
}

// Receipt for submissions
export interface Receipt {
  id: string
  tenderId: string
  bidId?: string

  type: "bid_submission" | "bid_replacement" | "bid_withdrawal" | "clarification" | "dispute"

  receiptNumber: string
  hash: string

  metadata: Record<string, any>
  timestamp: Date

  createdAt: Date
}

// Notification
export interface Notification {
  id: string
  userId: string

  type:
  | "tender_published"
  | "clarification_answered"
  | "submission_received"
  | "evaluation_complete"
  | "award_issued"
  | "dispute_filed"
  | "dispute_update"
  | "milestone_approved"
  | "milestone_payment"

  title: string
  message: string

  relatedId?: string
  relatedType?: "tender" | "bid" | "clarification" | "dispute" | "milestone"

  isRead: boolean
  readAt?: Date

  createdAt: Date
}
