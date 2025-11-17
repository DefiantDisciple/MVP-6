"use client"

import useSWR from "swr"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, formatCurrency } from "@/lib/formatters"
import type { Tender } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ClosedPanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=closed", fetcher)

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
        <h2 className="text-xl font-semibold text-foreground">Closed Contracts</h2>
        <p className="text-sm text-muted-foreground mt-1">Archive of completed projects with audit references</p>
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Project</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Service Provider</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Completion Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Final Value</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Audit Ref</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders && tenders.length > 0 ? (
                tenders.map((tender) => (
                  <tr key={tender.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{tender.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{tender.winningProvider}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(tender.completionDate!)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatCurrency(tender.contractValue || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                        {tender.auditRef}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log("Download summary", tender.id)
                        }}
                        className="gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No closed contracts
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
