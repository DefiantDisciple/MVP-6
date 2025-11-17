"use client"

import { useState } from "react"
import useSWR from "swr"
import { FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/formatters"
import type { Tender } from "@/lib/types"
import EvaluationDrawer from "./evaluation-drawer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EvaluationPanel() {
  const { data: tenders, isLoading, mutate } = useSWR<Tender[]>("/api/tenders?stage=evaluation", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const { toast } = useToast()

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
        <h2 className="text-xl font-semibold text-foreground">Under Evaluation</h2>
        <p className="text-sm text-muted-foreground mt-1">Review technical submissions and set preferred bidders</p>
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tender</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Closed</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Submissions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenders && tenders.length > 0 ? (
                tenders.map((tender) => (
                  <tr key={tender.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{tender.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(tender.closingTime)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{tender.submissions}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
                        {tender.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" onClick={() => setSelectedTender(tender)} className="gap-1.5">
                        <FileCheck className="h-3.5 w-3.5" />
                        Open Evaluation
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No tenders under evaluation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTender && (
        <EvaluationDrawer
          tender={selectedTender}
          open={!!selectedTender}
          onClose={() => setSelectedTender(null)}
          onPreferredSet={() => {
            mutate()
            setSelectedTender(null)
            toast({
              title: "Preferred Bidder Set",
              description: "Technical evaluation locked and financials unsealed",
            })
          }}
        />
      )}
    </>
  )
}
