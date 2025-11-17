import { type NextRequest, NextResponse } from "next/server"
import { escrowAdapter, EscrowHelpers } from "@/lib/escrow-adapter"
import { mockEscrowEvents } from "@/lib/mock-data"

// POST - Handle webhook callbacks from escrow providers
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-escrow-signature') || ''
    const providerId = request.headers.get('x-escrow-provider') || 'generic'
    
    // Validate webhook signature
    const webhookSecret = process.env.ESCROW_PROVIDER_WEBHOOK_SECRET || 'mock-secret'
    const isValidSignature = EscrowHelpers.validateWebhook(body, signature, webhookSecret)
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { event_type, escrow_id, data } = payload

    console.log(`Received escrow webhook: ${event_type} for ${escrow_id}`)

    // Process different webhook events
    switch (event_type) {
      case 'escrow.created':
        await handleEscrowCreated(escrow_id, data)
        break
      
      case 'escrow.funded':
        await handleEscrowFunded(escrow_id, data)
        break
      
      case 'escrow.released':
        await handleEscrowReleased(escrow_id, data)
        break
      
      case 'escrow.refunded':
        await handleEscrowRefunded(escrow_id, data)
        break
      
      case 'escrow.disputed':
        await handleEscrowDisputed(escrow_id, data)
        break
      
      case 'escrow.resolved':
        await handleEscrowResolved(escrow_id, data)
        break
      
      case 'escrow.expired':
        await handleEscrowExpired(escrow_id, data)
        break
      
      default:
        console.warn(`Unknown webhook event type: ${event_type}`)
    }

    // Mirror the event to our audit system
    await escrowAdapter.mirrorEvent(event_type, {
      escrowId: escrow_id,
      providerId,
      data,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ success: true, message: "Webhook processed" })
  } catch (error) {
    console.error("[v0] Escrow webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle escrow creation confirmation
async function handleEscrowCreated(escrowId: string, data: any) {
  try {
    console.log(`Escrow created: ${escrowId}`, data)
    
    // Update internal records
    // This would typically update the tender status to indicate escrow is ready
    
    // Send notification to relevant parties
    await sendNotification('escrow_created', {
      escrowId,
      tenderId: data.tender_id,
      amount: data.amount,
      currency: data.currency
    })
  } catch (error) {
    console.error('Failed to handle escrow created:', error)
  }
}

// Handle escrow funding confirmation
async function handleEscrowFunded(escrowId: string, data: any) {
  try {
    console.log(`Escrow funded: ${escrowId}`, data)
    
    // Update tender status to indicate funds are secured
    // This might trigger the start of work or milestone tracking
    
    await sendNotification('escrow_funded', {
      escrowId,
      amount: data.amount,
      fundedAt: data.funded_at
    })
  } catch (error) {
    console.error('Failed to handle escrow funded:', error)
  }
}

// Handle payment release confirmation
async function handleEscrowReleased(escrowId: string, data: any) {
  try {
    console.log(`Escrow released: ${escrowId}`, data)
    
    // Update tender/milestone status
    // Mark payment as completed
    // Update provider payment history
    
    await sendNotification('payment_released', {
      escrowId,
      amount: data.amount,
      releasedAt: data.released_at,
      recipient: data.recipient
    })
  } catch (error) {
    console.error('Failed to handle escrow released:', error)
  }
}

// Handle refund confirmation
async function handleEscrowRefunded(escrowId: string, data: any) {
  try {
    console.log(`Escrow refunded: ${escrowId}`, data)
    
    // Update tender status
    // Handle refund processing
    // Update financial records
    
    await sendNotification('payment_refunded', {
      escrowId,
      amount: data.amount,
      reason: data.reason,
      refundedAt: data.refunded_at
    })
  } catch (error) {
    console.error('Failed to handle escrow refunded:', error)
  }
}

// Handle dispute initiation
async function handleEscrowDisputed(escrowId: string, data: any) {
  try {
    console.log(`Escrow disputed: ${escrowId}`, data)
    
    // Create internal dispute record
    // Notify dispute resolution team
    // Pause any automated processes
    
    await sendNotification('escrow_disputed', {
      escrowId,
      disputeId: data.dispute_id,
      reason: data.reason,
      initiatedBy: data.initiated_by,
      disputedAt: data.disputed_at
    })
  } catch (error) {
    console.error('Failed to handle escrow disputed:', error)
  }
}

// Handle dispute resolution
async function handleEscrowResolved(escrowId: string, data: any) {
  try {
    console.log(`Escrow resolved: ${escrowId}`, data)
    
    // Update dispute status
    // Apply resolution (release, refund, partial, etc.)
    // Update all relevant records
    
    await sendNotification('dispute_resolved', {
      escrowId,
      disputeId: data.dispute_id,
      resolution: data.resolution,
      resolvedAt: data.resolved_at,
      finalAction: data.final_action
    })
  } catch (error) {
    console.error('Failed to handle escrow resolved:', error)
  }
}

// Handle escrow expiration
async function handleEscrowExpired(escrowId: string, data: any) {
  try {
    console.log(`Escrow expired: ${escrowId}`, data)
    
    // Handle automatic expiration
    // This might trigger automatic refund or other actions
    // Update tender status
    
    await sendNotification('escrow_expired', {
      escrowId,
      expiredAt: data.expired_at,
      autoAction: data.auto_action
    })
  } catch (error) {
    console.error('Failed to handle escrow expired:', error)
  }
}

// Send notification to relevant parties
async function sendNotification(eventType: string, data: any) {
  try {
    // This would integrate with the notification system
    // For now, just log the notification
    console.log(`Notification: ${eventType}`, data)
    
    // In production, this would:
    // 1. Determine who should be notified based on the event and escrow details
    // 2. Send emails, SMS, or in-app notifications
    // 3. Create notification records in the database
    
    // Example: Send to notification API
    // await fetch('/api/notifications', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: eventType,
    //     recipients: ['entity-1', 'provider-1'], // Determine based on escrow
    //     data
    //   })
    // })
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}

// GET - Webhook endpoint info (for debugging)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/escrow/webhook',
    methods: ['POST'],
    description: 'Webhook endpoint for escrow provider callbacks',
    supportedEvents: [
      'escrow.created',
      'escrow.funded',
      'escrow.released',
      'escrow.refunded',
      'escrow.disputed',
      'escrow.resolved',
      'escrow.expired'
    ],
    headers: {
      'x-escrow-signature': 'Required - Webhook signature for validation',
      'x-escrow-provider': 'Optional - Provider ID (defaults to generic)'
    }
  })
}
