"use client"

import { useState } from "react"
import useSWR from "swr"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Tender } from "@/lib/types"
import MilestoneDetailDrawer from "./milestone-detail-drawer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ActivePanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=active", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">Active Contracts</h2>
        <p className="text-sm text-muted-foreground mt-1">Monitor execution progress and escrow status</p>
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Service Provider</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Current Milestone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Progress</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Signatures</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Escrow Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders && tenders.length > 0 ? (
                tenders.map((tender) => (
                  <tr key={tender.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{tender.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{tender.winningProvider}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{tender.currentMilestone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${tender.progress}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{tender.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {tender.signatures?.current}/{tender.signatures?.total}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          tender.escrowStatus === "Auto-released"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {tender.escrowStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTender(tender)} className="gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No active contracts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTender && (
        <MilestoneDetailDrawer
          tender={selectedTender}
          open={!!selectedTender}
          onClose={() => setSelectedTender(null)}
        />
      )}
    </>
  )
}
