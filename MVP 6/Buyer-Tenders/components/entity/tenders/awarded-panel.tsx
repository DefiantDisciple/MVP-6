"use client"

import { useState } from "react"
import useSWR from "swr"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, formatCurrency } from "@/lib/formatters"
import type { Tender } from "@/lib/types"
import ContractSummaryDrawer from "./contract-summary-drawer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AwardedPanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=awarded", fetcher)
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
        <h2 className="text-xl font-semibold text-foreground">Awarded Contracts</h2>
        <p className="text-sm text-muted-foreground mt-1">Contracts confirmed and ready for execution</p>
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Winning Provider</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Contract Value</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Award Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Next Step</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders && tenders.length > 0 ? (
                tenders.map((tender) => (
                  <tr key={tender.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{tender.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{tender.winningProvider}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatCurrency(tender.contractValue || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(tender.awardDate!)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
                        {tender.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTender(tender)} className="gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        View Summary
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No awarded contracts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTender && (
        <ContractSummaryDrawer
          tender={selectedTender}
          open={!!selectedTender}
          onClose={() => setSelectedTender(null)}
        />
      )}
    </>
  )
}
