"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Tender } from "@/lib/types"

interface MilestoneDetailDrawerProps {
  tender: Tender
  open: boolean
  onClose: () => void
}

export default function MilestoneDetailDrawer({ tender, open, onClose }: MilestoneDetailDrawerProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-card border-l border-border z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Execution Monitor</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tender.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{tender.winningProvider}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Milestone</p>
              <p className="text-sm text-foreground mt-1">{tender.currentMilestone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <p className="text-sm text-foreground mt-1">{tender.progress}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Signatures</p>
              <p className="text-sm text-foreground mt-1">
                {tender.signatures?.current}/{tender.signatures?.total}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Escrow Status</h4>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-sm text-foreground">
                Status: <span className="font-medium">{tender.escrowStatus}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                No payment approval controls are available in this interface
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Milestone Timeline</h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Milestone {i}</p>
                    <p className="text-xs text-muted-foreground mt-1">Verification proofs attached</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
