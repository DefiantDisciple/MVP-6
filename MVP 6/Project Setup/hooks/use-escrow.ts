import { useState, useCallback } from 'react'
import { escrowAdapter, type EscrowDetails } from '@/lib/escrow-adapter'

interface UseEscrowOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

interface EscrowOperationResult {
  success: boolean
  message?: string
  error?: string
  data?: any
}

export function useEscrow(options: UseEscrowOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOperation = useCallback(async (
    operation: () => Promise<any>,
    successMessage: string
  ): Promise<EscrowOperationResult> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await operation()
      
      options.onSuccess?.(successMessage)
      return { success: true, message: successMessage, data: result }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      options.onError?.(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [options])

  const createEscrow = useCallback(async (
    tenderId: string,
    amount: number,
    currency = 'BWP'
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.createEscrow(tenderId, amount, currency),
      'Escrow created successfully'
    )
  }, [handleOperation])

  const releasePayment = useCallback(async (
    escrowRef: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.releasePayment(escrowRef),
      'Payment released successfully'
    )
  }, [handleOperation])

  const holdFunds = useCallback(async (
    escrowRef: string,
    milestoneId: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.holdFunds(escrowRef, milestoneId),
      'Funds held successfully'
    )
  }, [handleOperation])

  const refundPayment = useCallback(async (
    escrowRef: string,
    reason: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.refundPayment(escrowRef, reason),
      'Payment refunded successfully'
    )
  }, [handleOperation])

  const disputeEscrow = useCallback(async (
    escrowRef: string,
    disputeId: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.disputeEscrow(escrowRef, disputeId),
      'Escrow disputed successfully'
    )
  }, [handleOperation])

  const resolveDispute = useCallback(async (
    escrowRef: string,
    resolution: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.resolveDispute(escrowRef, resolution),
      'Dispute resolved successfully'
    )
  }, [handleOperation])

  const getEscrowDetails = useCallback(async (
    escrowRef: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.getEscrowDetails(escrowRef),
      'Escrow details retrieved'
    )
  }, [handleOperation])

  const getEscrowHistory = useCallback(async (
    tenderId: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      () => escrowAdapter.getEscrowHistory(tenderId),
      'Escrow history retrieved'
    )
  }, [handleOperation])

  // API-based operations for when adapter is not available
  const createEscrowViaAPI = useCallback(async (
    tenderId: string,
    amount: number,
    currency = 'BWP'
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch('/api/escrow/operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'create',
            tenderId,
            amount,
            currency
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to create escrow')
        }
        
        return response.json()
      },
      'Escrow created successfully'
    )
  }, [handleOperation])

  const releasePaymentViaAPI = useCallback(async (
    escrowRef: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch('/api/escrow/operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'release',
            escrowRef
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to release payment')
        }
        
        return response.json()
      },
      'Payment released successfully'
    )
  }, [handleOperation])

  const holdFundsViaAPI = useCallback(async (
    escrowRef: string,
    milestoneId: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch('/api/escrow/operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'hold',
            escrowRef,
            milestoneId
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to hold funds')
        }
        
        return response.json()
      },
      'Funds held successfully'
    )
  }, [handleOperation])

  const refundPaymentViaAPI = useCallback(async (
    escrowRef: string,
    reason: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch('/api/escrow/operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operation: 'refund',
            escrowRef,
            reason
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to refund payment')
        }
        
        return response.json()
      },
      'Payment refunded successfully'
    )
  }, [handleOperation])

  const validateEscrowViaAPI = useCallback(async (
    escrowRef: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch(
          `/api/escrow/operations?operation=validate&escrowRef=${encodeURIComponent(escrowRef)}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to validate escrow')
        }
        
        return response.json()
      },
      'Escrow validated'
    )
  }, [handleOperation])

  const getEscrowDetailsViaAPI = useCallback(async (
    escrowRef: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch(
          `/api/escrow/operations?operation=details&escrowRef=${encodeURIComponent(escrowRef)}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to get escrow details')
        }
        
        return response.json()
      },
      'Escrow details retrieved'
    )
  }, [handleOperation])

  const getEscrowHistoryViaAPI = useCallback(async (
    tenderId: string
  ): Promise<EscrowOperationResult> => {
    return handleOperation(
      async () => {
        const response = await fetch(
          `/api/escrow/operations?operation=history&tenderId=${encodeURIComponent(tenderId)}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to get escrow history')
        }
        
        return response.json()
      },
      'Escrow history retrieved'
    )
  }, [handleOperation])

  return {
    // State
    isLoading,
    error,
    
    // Direct adapter operations (for when IC is available)
    createEscrow,
    releasePayment,
    holdFunds,
    refundPayment,
    disputeEscrow,
    resolveDispute,
    getEscrowDetails,
    getEscrowHistory,
    
    // API-based operations (fallback or when adapter not available)
    createEscrowViaAPI,
    releasePaymentViaAPI,
    holdFundsViaAPI,
    refundPaymentViaAPI,
    validateEscrowViaAPI,
    getEscrowDetailsViaAPI,
    getEscrowHistoryViaAPI,
    
    // Utility
    clearError: () => setError(null),
    isReady: escrowAdapter.isReady()
  }
}
