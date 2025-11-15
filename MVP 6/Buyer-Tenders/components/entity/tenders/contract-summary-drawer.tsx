"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/formatters"
import type { Tender } from "@/lib/types"

interface ContractSummaryDrawerProps {
  tender: Tender
  open: boolean
  onClose: () => void
}

export default function ContractSummaryDrawer({ tender, open, onClose }: ContractSummaryDrawerProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Contract Summary</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tender.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Winning Provider</p>
              <p className="text-sm text-foreground mt-1">{tender.winningProvider}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contract Value</p>
              <p className="text-sm text-foreground mt-1">{formatCurrency(tender.contractValue || 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Award Date</p>
              <p className="text-sm text-foreground mt-1">{formatDate(tender.awardDate!)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Step</p>
              <p className="text-sm text-foreground mt-1">{tender.status}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
