import { type NextRequest, NextResponse } from "next/server"
import { escrowAdapter, EscrowHelpers } from "@/lib/escrow-adapter"

// POST - Create escrow operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation, ...params } = body

    switch (operation) {
      case 'create': {
        const { tenderId, amount, currency = 'BWP' } = params
        
        if (!tenderId || !amount) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
        }

        if (!EscrowHelpers.validateAmount(amount)) {
          return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        const escrowRef = await escrowAdapter.createEscrow(tenderId, amount, currency)
        
        if (!escrowRef) {
          return NextResponse.json({ error: "Failed to create escrow" }, { status: 500 })
        }

        // Mirror event for audit trail
        await escrowAdapter.mirrorEvent('escrow_created', {
          escrowRef,
          tenderId,
          amount,
          currency,
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          escrowRef,
          message: "Escrow created successfully"
        })
      }

      case 'release': {
        const { escrowRef } = params
        
        if (!escrowRef) {
          return NextResponse.json({ error: "Missing escrow reference" }, { status: 400 })
        }

        const success = await escrowAdapter.releasePayment(escrowRef)
        
        if (!success) {
          return NextResponse.json({ error: "Failed to release payment" }, { status: 500 })
        }

        // Mirror event for audit trail
        await escrowAdapter.mirrorEvent('payment_released', {
          escrowRef,
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          message: "Payment released successfully"
        })
      }

      case 'hold': {
        const { escrowRef, milestoneId } = params
        
        if (!escrowRef || !milestoneId) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
        }

        const success = await escrowAdapter.holdFunds(escrowRef, milestoneId)
        
        if (!success) {
          return NextResponse.json({ error: "Failed to hold funds" }, { status: 500 })
        }

        // Mirror event for audit trail
        await escrowAdapter.mirrorEvent('funds_held', {
          escrowRef,
          milestoneId,
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          message: "Funds held successfully"
        })
      }

      case 'refund': {
        const { escrowRef, reason } = params
        
        if (!escrowRef || !reason) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
        }

        const success = await escrowAdapter.refundPayment(escrowRef, reason)
        
        if (!success) {
          return NextResponse.json({ error: "Failed to refund payment" }, { status: 500 })
        }

        // Mirror event for audit trail
        await escrowAdapter.mirrorEvent('payment_refunded', {
          escrowRef,
          reason,
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          message: "Payment refunded successfully"
        })
      }

      case 'dispute': {
        const { escrowRef, disputeId } = params
        
        if (!escrowRef || !disputeId) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
        }

        const success = await escrowAdapter.disputeEscrow(escrowRef, disputeId)
        
        if (!success) {
          return NextResponse.json({ error: "Failed to dispute escrow" }, { status: 500 })
        }

        // Mirror event for audit trail
        await escrowAdapter.mirrorEvent('escrow_disputed', {
          escrowRef,
          disputeId,
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          message: "Escrow disputed successfully"
        })
      }

      case 'resolve': {
        const { escrowRef, resolution } = params
        
        if (!escrowRef || !resolution) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
        }

        const success = await escrowAdapter.resolveDispute(escrowRef, resolution)
        
        if (!success) {
          return NextResponse.json({ error: "Failed to resolve dispute" }, { status: 500 })
        }

        // Mirror event for audit trail
        await escrowAdapter.mirrorEvent('dispute_resolved', {
          escrowRef,
          resolution,
          timestamp: new Date().toISOString()
        })

        return NextResponse.json({ 
          success: true, 
          message: "Dispute resolved successfully"
        })
      }

      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Escrow operation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET - Get escrow details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const escrowRef = searchParams.get("escrowRef")
    const tenderId = searchParams.get("tenderId")
    const operation = searchParams.get("operation")

    if (operation === 'details' && escrowRef) {
      const details = await escrowAdapter.getEscrowDetails(escrowRef)
      
      if (!details) {
        return NextResponse.json({ error: "Escrow not found" }, { status: 404 })
      }

      return NextResponse.json({ escrow: details })
    }

    if (operation === 'history' && tenderId) {
      const history = await escrowAdapter.getEscrowHistory(tenderId)
      return NextResponse.json({ events: history })
    }

    if (operation === 'validate' && escrowRef) {
      const details = await escrowAdapter.getEscrowDetails(escrowRef)
      const isValid = details !== null
      
      return NextResponse.json({ 
        valid: isValid,
        escrowRef: EscrowHelpers.formatEscrowRef(escrowRef),
        status: details?.status || null
      })
    }

    return NextResponse.json({ error: "Invalid operation or missing parameters" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Escrow query error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
