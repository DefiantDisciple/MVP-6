// TypeScript types for tender management

export type TenderStage = "open" | "evaluation" | "notice" | "awarded" | "active" | "closed"

export interface Tender {
  id: string
  title: string
  postedDate: string
  closingTime: string
  submissions: number
  status: string
  estimatedValue?: number
  preferredProvider?: string
  noticeDate?: string
  awardDate?: string
  winningProvider?: string
  contractValue?: number
  currentMilestone?: string
  progress?: number
  signatures?: { current: number; total: number }
  escrowStatus?: string
  completionDate?: string
  auditRef?: string
  documents?: Document[]
}

export interface Document {
  id: string
  name: string
  size: string
  uploadDate: string
}

export interface Evaluation {
  tenderId: string
  providerId: string
  criteria: EvaluationCriteria[]
}

export interface EvaluationCriteria {
  name: string
  weight: number
  score: number
  weightedTotal: number
}

export interface Dispute {
  id: string
  tenderId: string
  status: "pending" | "resolved" | "rejected"
  filedDate: string
  description: string
}
