"use client"

import useSWR from "swr"
import { Download, Archive } from "lucide-react"
import type { Tender } from "@/types/tender"
import { formatDate, formatCurrency } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ClosedPanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=closed&providerId=PROV-123", fetcher)
  const { toast } = useToast()

  const handleDownload = (tender: Tender) => {
    toast({
      title: "Download started",
      description: `Downloading summary for ${tender.title}`,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    )
  }

  if (!tenders || tenders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">You have no closed projects.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tenders.map((tender) => (
        <Card key={tender.id} className="p-6 bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Archive className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">{tender.title}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Completion Date:</span>
                  <p className="font-medium">{tender.completionDate ? formatDate(tender.completionDate) : "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Final Value:</span>
                  <p className="font-medium">{tender.contractValue ? formatCurrency(tender.contractValue) : "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Audit Reference:</span>
                  <p className="font-mono text-xs break-all">
                    {tender.auditRef ? tender.auditRef.substring(0, 32) + "..." : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleDownload(tender)}>
              <Download className="h-4 w-4 mr-2" />
              Download Summary
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
