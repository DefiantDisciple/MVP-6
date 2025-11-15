"use client"

import useSWR from "swr"
import { useState } from "react"
import { Eye, Award } from "lucide-react"
import type { Tender } from "@/types/tender"
import { formatDate, formatCurrency } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AwardedPanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=awarded&providerId=PROV-123", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)

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
        <p className="text-muted-foreground">You have no awarded contracts at this time.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tenders.map((tender) => (
          <Card
            key={tender.id}
            className="p-6 bg-gradient-to-r from-green-50/50 to-transparent border-l-4 border-l-green-500"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-foreground">{tender.title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Contract Value:</span>
                    <p className="font-medium text-green-700">
                      {tender.contractValue ? formatCurrency(tender.contractValue) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Award Date:</span>
                    <p className="font-medium">{tender.awardDate ? formatDate(tender.awardDate) : "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Step:</span>
                    <p className="font-medium">Contract Signing</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="success">Awarded</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedTender(tender)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={!!selectedTender} onOpenChange={(open) => !open && setSelectedTender(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedTender && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTender.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Award className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Contract Awarded</p>
                    <p className="text-sm text-green-700">Congratulations on winning this tender</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Contract Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Contract Value:</dt>
                      <dd className="font-medium">
                        {selectedTender.contractValue ? formatCurrency(selectedTender.contractValue) : "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Award Date:</dt>
                      <dd className="font-medium">
                        {selectedTender.awardDate ? formatDate(selectedTender.awardDate) : "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd className="font-medium">{selectedTender.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Procuring Entity:</dt>
                      <dd className="font-medium">{selectedTender.procuringEntity}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
                    <li>Review contract documents</li>
                    <li>Schedule contract signing ceremony</li>
                    <li>Prepare project execution plan</li>
                    <li>Set up escrow and milestone tracking</li>
                  </ol>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
