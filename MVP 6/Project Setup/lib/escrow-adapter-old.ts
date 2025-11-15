import { Actor, HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { actorFactory, CANISTER_IDS, PREVIEW_MODE } from '@/src/ic/agent'
import type { EscrowEvent } from './types'

// Third-party escrow provider interface
export interface EscrowProvider {
  name: string
  apiUrl: string
  apiKey: string
  webhookSecret: string
  supportedCurrencies: string[]
  features: EscrowProviderFeatures
}

export interface EscrowProviderFeatures {
  milestonePayments: boolean
  disputeResolution: boolean
  multiCurrency: boolean
  instantRelease: boolean
  scheduledRelease: boolean
  partialRelease: boolean
}

// Standardized escrow request/response interfaces
export interface CreateEscrowRequest {
  tenderId: string
  amount: number
  currency: string
  buyerInfo: PartyInfo
  sellerInfo: PartyInfo
  description: string
  terms: EscrowTerms
  metadata?: Record<string, any>
}

export interface PartyInfo {
  id: string
  name: string
  email: string
  type: 'entity' | 'provider'
  verificationStatus: 'verified' | 'pending' | 'unverified'
}

export interface EscrowTerms {
  releaseConditions: string[]
  disputeResolutionMethod: 'arbitration' | 'mediation' | 'automatic'
  timeoutDays: number
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  description: string
  amount: number
  dueDate: Date
  conditions: string[]
}

export interface EscrowResponse {
  success: boolean
  escrowId: string
  providerReference: string
  status: EscrowStatus
  fees: EscrowFees
  estimatedCompletionDate: Date
  error?: string
}

export interface EscrowFees {
  platformFee: number
  processingFee: number
  totalFees: number
  currency: string
}

// Escrow details type
export interface EscrowDetails {
  ref: string
  tender_id: bigint
  amount: bigint
  currency: string
  status: EscrowStatus
  created_ts: bigint
  updated_ts: bigint
  milestone_id?: string
  dispute_id?: string
  metadata: Record<string, string>
}

// Escrow status enum
export type EscrowStatus = 
  | 'created' 
  | 'held' 
  | 'released' 
  | 'refunded' 
  | 'disputed' 
  | 'resolved'

// Escrow transaction type
export interface EscrowTransaction {
  id: string
  escrow_ref: string
  type: 'deposit' | 'hold' | 'release' | 'refund' | 'dispute'
  amount: bigint
  timestamp: bigint
  performed_by: string
  description: string
  metadata?: Record<string, string>
}

// IDL factory for the escrow adapter canister
const idlFactory = ({ IDL }: any) => {
  const EscrowDetails = IDL.Record({
    ref: IDL.Text,
    tender_id: IDL.Nat,
    amount: IDL.Nat64,
    currency: IDL.Text,
    status: IDL.Text,
    created_ts: IDL.Nat64,
    updated_ts: IDL.Nat64,
    milestone_id: IDL.Opt(IDL.Text),
    dispute_id: IDL.Opt(IDL.Text),
    metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
  })

  const EscrowEvent = IDL.Record({
    id: IDL.Text,
    escrow_ref: IDL.Text,
    event_type: IDL.Text,
    amount: IDL.Nat64,
    timestamp: IDL.Nat64,
    performed_by: IDL.Text,
    description: IDL.Text,
    metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
  })

  return IDL.Service({
    create_escrow: IDL.Func([IDL.Nat, IDL.Nat64, IDL.Text], [IDL.Text], []),
    release_payment: IDL.Func([IDL.Text], [IDL.Bool], []),
    hold_funds: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    refund_payment: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    get_escrow_details: IDL.Func([IDL.Text], [IDL.Opt(EscrowDetails)], ['query']),
    get_escrow_history: IDL.Func([IDL.Nat], [IDL.Vec(EscrowEvent)], ['query']),
    mirror_event: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    dispute_escrow: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    resolve_dispute: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], [])
  })
}

// Third-party escrow provider implementations
export abstract class BaseEscrowProvider {
  protected config: EscrowProvider

  constructor(config: EscrowProvider) {
    this.config = config
  }

  abstract createEscrow(request: CreateEscrowRequest): Promise<EscrowResponse>
  abstract releasePayment(escrowId: string, amount?: number): Promise<boolean>
  abstract holdFunds(escrowId: string, milestoneId: string): Promise<boolean>
  abstract refundPayment(escrowId: string, reason: string): Promise<boolean>
  abstract getEscrowDetails(escrowId: string): Promise<EscrowDetails | null>
  abstract disputeEscrow(escrowId: string, disputeReason: string): Promise<boolean>
  abstract resolveDispute(escrowId: string, resolution: string): Promise<boolean>

  // Common utility methods
  protected async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `${this.config.apiUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      throw new Error(`Escrow provider API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  protected validateWebhookSignature(payload: string, signature: string): boolean {
    // Implementation would depend on the provider's signature method
    // This is a placeholder for webhook signature validation
    return true
  }
}

// Example implementation for a generic escrow provider
export class GenericEscrowProvider extends BaseEscrowProvider {
  async createEscrow(request: CreateEscrowRequest): Promise<EscrowResponse> {
    try {
      const response = await this.makeRequest('/escrow/create', 'POST', {
        tender_id: request.tenderId,
        amount: request.amount,
        currency: request.currency,
        buyer: request.buyerInfo,
        seller: request.sellerInfo,
        description: request.description,
        terms: request.terms,
        metadata: request.metadata
      })

      return {
        success: true,
        escrowId: response.escrow_id,
        providerReference: response.reference,
        status: response.status as EscrowStatus,
        fees: response.fees,
        estimatedCompletionDate: new Date(response.estimated_completion),
      }
    } catch (error) {
      console.error('Failed to create escrow with provider:', error)
      return {
        success: false,
        escrowId: '',
        providerReference: '',
        status: 'created',
        fees: { platformFee: 0, processingFee: 0, totalFees: 0, currency: request.currency },
        estimatedCompletionDate: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async releasePayment(escrowId: string, amount?: number): Promise<boolean> {
    try {
      await this.makeRequest(`/escrow/${escrowId}/release`, 'POST', { amount })
      return true
    } catch (error) {
      console.error('Failed to release payment:', error)
      return false
    }
  }

  async holdFunds(escrowId: string, milestoneId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/escrow/${escrowId}/hold`, 'POST', { milestone_id: milestoneId })
      return true
    } catch (error) {
      console.error('Failed to hold funds:', error)
      return false
    }
  }

  async refundPayment(escrowId: string, reason: string): Promise<boolean> {
    try {
      await this.makeRequest(`/escrow/${escrowId}/refund`, 'POST', { reason })
      return true
    } catch (error) {
      console.error('Failed to refund payment:', error)
      return false
    }
  }

  async getEscrowDetails(escrowId: string): Promise<EscrowDetails | null> {
    try {
      const response = await this.makeRequest(`/escrow/${escrowId}`, 'GET')
      
      return {
        ref: response.reference,
        tender_id: BigInt(response.tender_id),
        amount: BigInt(response.amount * 100), // Convert to cents
        currency: response.currency,
        status: response.status,
        created_ts: BigInt(new Date(response.created_at).getTime()),
        updated_ts: BigInt(new Date(response.updated_at).getTime()),
        milestone_id: response.milestone_id,
        dispute_id: response.dispute_id,
        metadata: response.metadata || {}
      }
    } catch (error) {
      console.error('Failed to get escrow details:', error)
      return null
    }
  }

  async disputeEscrow(escrowId: string, disputeReason: string): Promise<boolean> {
    try {
      await this.makeRequest(`/escrow/${escrowId}/dispute`, 'POST', { reason: disputeReason })
      return true
    } catch (error) {
      console.error('Failed to dispute escrow:', error)
      return false
    }
  }

  async resolveDispute(escrowId: string, resolution: string): Promise<boolean> {
    try {
      await this.makeRequest(`/escrow/${escrowId}/resolve`, 'POST', { resolution })
      return true
    } catch (error) {
      console.error('Failed to resolve dispute:', error)
      return false
    }
  }
}

// Escrow adapter service that manages multiple providers
export class EscrowAdapterService {
  private providers: Map<string, BaseEscrowProvider> = new Map()
  private defaultProvider: string | null = null
  private initialized = false

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    try {
      // Initialize providers based on configuration
      // In production, this would load from environment variables or database
      
      if (PREVIEW_MODE) {
        // Use mock provider in preview mode
        this.providers.set('mock', new MockEscrowProvider({
          name: 'Mock Escrow Provider',
          apiUrl: 'https://mock-escrow.example.com/api',
          apiKey: 'mock-key',
          webhookSecret: 'mock-secret',
          supportedCurrencies: ['BWP', 'USD', 'EUR'],
          features: {
            milestonePayments: true,
            disputeResolution: true,
            multiCurrency: true,
            instantRelease: true,
            scheduledRelease: true,
            partialRelease: true
          }
        }))
        this.defaultProvider = 'mock'
      } else {
        // Initialize real providers
        const genericProvider = new GenericEscrowProvider({
          name: process.env.ESCROW_PROVIDER_NAME || 'Generic Provider',
          apiUrl: process.env.ESCROW_PROVIDER_API_URL || '',
          apiKey: process.env.ESCROW_PROVIDER_API_KEY || '',
          webhookSecret: process.env.ESCROW_PROVIDER_WEBHOOK_SECRET || '',
          supportedCurrencies: (process.env.ESCROW_PROVIDER_CURRENCIES || 'BWP,USD').split(','),
          features: {
            milestonePayments: process.env.ESCROW_PROVIDER_MILESTONES === 'true',
            disputeResolution: process.env.ESCROW_PROVIDER_DISPUTES === 'true',
            multiCurrency: process.env.ESCROW_PROVIDER_MULTICURRENCY === 'true',
            instantRelease: process.env.ESCROW_PROVIDER_INSTANT === 'true',
            scheduledRelease: process.env.ESCROW_PROVIDER_SCHEDULED === 'true',
            partialRelease: process.env.ESCROW_PROVIDER_PARTIAL === 'true'
          }
        })
        
        this.providers.set('generic', genericProvider)
        this.defaultProvider = 'generic'
      }

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize escrow providers:', error)
    }
  }

  private getProvider(providerId?: string): BaseEscrowProvider | null {
    const id = providerId || this.defaultProvider
    return id ? this.providers.get(id) || null : null
  }

  // Create a new escrow for a tender
  async createEscrow(tenderId: string, amount: number, currency: string = 'BWP', providerId?: string): Promise<string | null> {
    const provider = this.getProvider(providerId)
    if (!provider) {
      throw new Error('No escrow provider available')
    }

    try {
      // Create standardized request
      const request: CreateEscrowRequest = {
        tenderId,
        amount,
        currency,
        buyerInfo: {
          id: 'entity-1', // This would come from the authenticated user
          name: 'Procurement Entity',
          email: 'entity@example.com',
          type: 'entity',
          verificationStatus: 'verified'
        },
        sellerInfo: {
          id: 'provider-1', // This would come from the tender award
          name: 'Service Provider',
          email: 'provider@example.com',
          type: 'provider',
          verificationStatus: 'verified'
        },
        description: `Escrow for tender ${tenderId}`,
        terms: {
          releaseConditions: ['Milestone completion', 'Entity approval'],
          disputeResolutionMethod: 'arbitration',
          timeoutDays: 30
        }
      }

      const response = await provider.createEscrow(request)
      
      if (response.success) {
        // Log the escrow creation to our internal system
        await this.logEscrowEvent('created', response.escrowId, {
          tenderId,
          amount,
          currency,
          provider: providerId || this.defaultProvider,
          providerReference: response.providerReference
        })
        
        return response.escrowId
      } else {
        throw new Error(response.error || 'Failed to create escrow')
      }
    } catch (error) {
      console.error('Failed to create escrow:', error)
      throw new Error('Failed to create escrow')
    }
  }

  // Release payment from escrow
  async releasePayment(escrowRef: string): Promise<boolean> {
    if (PREVIEW_MODE) {
      return true
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      return await this.actor.release_payment(escrowRef)
    } catch (error) {
      console.error('Failed to release payment:', error)
      throw new Error('Failed to release payment')
    }
  }

  // Hold funds for a milestone
  async holdFunds(escrowRef: string, milestoneId: string): Promise<boolean> {
    if (PREVIEW_MODE) {
      return true
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      return await this.actor.hold_funds(escrowRef, milestoneId)
    } catch (error) {
      console.error('Failed to hold funds:', error)
      throw new Error('Failed to hold funds')
    }
  }

  // Refund payment
  async refundPayment(escrowRef: string, reason: string): Promise<boolean> {
    if (PREVIEW_MODE) {
      return true
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      return await this.actor.refund_payment(escrowRef, reason)
    } catch (error) {
      console.error('Failed to refund payment:', error)
      throw new Error('Failed to refund payment')
    }
  }

  // Get escrow details
  async getEscrowDetails(escrowRef: string): Promise<EscrowDetails | null> {
    if (PREVIEW_MODE) {
      // Return mock escrow details in preview mode
      return {
        ref: escrowRef,
        tender_id: BigInt(1),
        amount: BigInt(100000),
        currency: 'BWP',
        status: 'created',
        created_ts: BigInt(Date.now()),
        updated_ts: BigInt(Date.now()),
        metadata: {}
      }
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      const details = await this.actor.get_escrow_details(escrowRef)
      return details || null
    } catch (error) {
      console.error('Failed to get escrow details:', error)
      return null
    }
  }

  // Get escrow history for a tender
  async getEscrowHistory(tenderId: string): Promise<EscrowEvent[]> {
    if (PREVIEW_MODE) {
      // Return mock history in preview mode
      return []
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      const tenderIdBigInt = BigInt(tenderId.replace(/\D/g, '') || '0')
      const history = await this.actor.get_escrow_history(tenderIdBigInt)
      
      // Convert IC events to frontend format
      return history.map((event: any) => ({
        id: event.id,
        tenderId: tenderId,
        type: event.event_type as any,
        amount: Number(event.amount) / 100, // Convert from cents
        balance: 0, // Would need to calculate
        description: event.description,
        performedBy: event.performed_by,
        performedByRole: 'system' as any,
        timestamp: new Date(Number(event.timestamp)),
        createdAt: new Date(Number(event.timestamp))
      }))
    } catch (error) {
      console.error('Failed to get escrow history:', error)
      return []
    }
  }

  // Mirror event to external systems
  async mirrorEvent(kind: string, payload: any): Promise<boolean> {
    if (PREVIEW_MODE) {
      console.log('Mirror event (preview):', kind, payload)
      return true
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      const payloadString = JSON.stringify(payload)
      return await this.actor.mirror_event(kind, payloadString)
    } catch (error) {
      console.error('Failed to mirror event:', error)
      return false
    }
  }

  // Dispute escrow
  async disputeEscrow(escrowRef: string, disputeId: string): Promise<boolean> {
    if (PREVIEW_MODE) {
      return true
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      return await this.actor.dispute_escrow(escrowRef, disputeId)
    } catch (error) {
      console.error('Failed to dispute escrow:', error)
      throw new Error('Failed to dispute escrow')
    }
  }

  // Resolve dispute
  async resolveDispute(escrowRef: string, resolution: string): Promise<boolean> {
    if (PREVIEW_MODE) {
      return true
    }

    if (!this.actor) {
      await this.initializeActor()
    }

    if (!this.actor) {
      throw new Error('Escrow adapter not available')
    }

    try {
      return await this.actor.resolve_dispute(escrowRef, resolution)
    } catch (error) {
      console.error('Failed to resolve dispute:', error)
      throw new Error('Failed to resolve dispute')
    }
  }

  // Check if adapter is ready
  isReady(): boolean {
    return PREVIEW_MODE || this.initialized
  }
}

// Singleton instance
export const escrowAdapter = new EscrowAdapterService()

// Helper functions for escrow operations
export const EscrowHelpers = {
  // Format escrow reference
  formatEscrowRef: (ref: string): string => {
    return ref.toUpperCase()
  },

  // Parse escrow reference to get tender ID
  parseTenderId: (ref: string): string | null => {
    const match = ref.match(/ESC-\d+-(\d+)/)
    return match ? match[1] : null
  },

  // Calculate escrow fees (example: 1% fee)
  calculateFees: (amount: number): number => {
    return Math.floor(amount * 0.01)
  },

  // Validate escrow amount
  validateAmount: (amount: number): boolean => {
    return amount > 0 && amount <= 1000000000 // Max 1B BWP
  },

  // Get escrow status color
  getStatusColor: (status: EscrowStatus): string => {
    switch (status) {
      case 'created': return 'blue'
      case 'held': return 'yellow'
      case 'released': return 'green'
      case 'refunded': return 'orange'
      case 'disputed': return 'red'
      case 'resolved': return 'purple'
      default: return 'gray'
    }
  }
}
