export type TenderStage = "open" | "notice" | "awarded" | "active" | "closed"

export type SubmissionStatus = "Submitted" | "Under Technical Review" | "Financial Unsealed" | "Completed"

export type DisputeStatus = "Pending" | "Under Review" | "Resolved - Upheld" | "Resolved - Rejected"

export interface Tender {
  id: string
  title: string
  postedDate: string
  closingDate: string
  category: string
  procuringEntity: string
  stage: TenderStage
  description?: string
  clarificationsCutoff?: string
  attachments?: { name: string; url: string }[]
  contractValue?: number
  awardDate?: string
  preferredProvider?: string
  noticeDate?: string
  currentMilestone?: string
  progressPercent?: number
  signaturesCompleted?: number
  signaturesTotal?: number
  escrowStatus?: "Auto-released" | "Pending Signatures"
  completionDate?: string
  auditRef?: string
}

export interface Submission {
  id: string
  tenderId: string
  providerId: string
  tenderTitle: string
  submittedAt: string
  technicalHash: string
  financialHash: string
  financialSealed: boolean
  status: SubmissionStatus
  replacedAt?: string
  withdrawnAt?: string
  auditLog: AuditEvent[]
}

export interface Clarification {
  id: string
  tenderId: string
  question: string
  answer?: string
  askedBy: string
  askedAt: string
  answeredAt?: string
}

export interface Dispute {
  id: string
  caseId: string
  tenderId: string
  tenderTitle: string
  providerId: string
  reason: string
  filedAt: string
  status: DisputeStatus
  decisionSummary?: string
  attachments?: { name: string; url: string }[]
}

export interface AuditEvent {
  timestamp: string
  action: string
  actor: string
  hash: string
}

export interface Receipt {
  documentType: "technical" | "financial"
  sha256: string
  uploadedAt: string
  sealed: boolean
}
