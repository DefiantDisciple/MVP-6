"use client"

import { useState } from "react"
import { X, Award, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Tender } from "@/lib/types"

interface EvaluationDrawerProps {
  tender: Tender
  open: boolean
  onClose: () => void
  onPreferredSet: () => void
}

export default function EvaluationDrawer({ tender, open, onClose, onPreferredSet }: EvaluationDrawerProps) {
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  if (!open) return null

  const handleSaveProgress = async () => {
    setSaving(true)
    try {
      await fetch("/api/evaluation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenderId: tender.id }),
      })
      toast({ title: "Progress Saved", description: "Evaluation progress saved successfully" })
    } finally {
      setSaving(false)
    }
  }

  const handleSetPreferred = async () => {
    try {
      await fetch("/api/evaluation/preferred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenderId: tender.id, providerId: "provider-1" }),
      })
      onPreferredSet()
    } catch (error) {
      toast({ title: "Error", description: "Failed to set preferred bidder", variant: "destructive" })
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-card border-l border-border z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Technical Evaluation</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tender.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{tender.submissions} submissions received</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Scoring Matrix</h4>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Criteria</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Weight (%)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Score (0-100)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Weighted Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Technical Capacity", weight: 30 },
                    { name: "Experience", weight: 25 },
                    { name: "Methodology", weight: 25 },
                    { name: "Team Qualification", weight: 20 },
                  ].map((criteria, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="px-4 py-3 text-sm text-foreground">{criteria.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{criteria.weight}%</td>
                      <td className="px-4 py-3">
                        <Input type="number" min="0" max="100" className="w-24" />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">0.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={handleSaveProgress} disabled={saving} className="gap-2 bg-transparent">
              <Save className="h-4 w-4" />
              Save Progress
            </Button>
            <Button onClick={handleSetPreferred} className="gap-2">
              <Award className="h-4 w-4" />
              Set Preferred Bidder
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
