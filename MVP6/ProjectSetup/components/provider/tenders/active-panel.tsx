"use client"

import useSWR from "swr"
import { useState } from "react"
import { Eye, TrendingUp, CheckCircle2 } from "lucide-react"
import type { Tender } from "@/types/tender"
import { formatCurrency } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface EscrowLog {
  id: string
  projectId: string
  milestone: string
  amount: number
  status: "Released" | "Pending"
  releasedAt?: string
  signatures: { name: string; signedAt: string }[]
}

export function ActivePanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=active&providerId=PROV-123", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const { data: escrowLogs } = useSWR<EscrowLog[]>(
    selectedTender ? `/api/escrow/logs?pid=${selectedTender.id}` : null,
    fetcher,
  )

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
        <p className="text-muted-foreground">You have no active projects at this time.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tenders.map((tender) => (
          <Card key={tender.id} className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-foreground">{tender.title}</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Current Milestone:</span>
                    <p className="font-medium">{tender.currentMilestone || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Progress:</span>
                    <p className="font-medium text-blue-600">{tender.progressPercent || 0}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Signatures:</span>
                    <p className="font-medium">
                      {tender.signaturesCompleted || 0}/{tender.signaturesTotal || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Escrow Status:</span>
                    <Badge variant={tender.escrowStatus === "Auto-released" ? "success" : "secondary"}>
                      {tender.escrowStatus || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contract Value:</span>
                    <p className="font-medium">{tender.contractValue ? formatCurrency(tender.contractValue) : "N/A"}</p>
                  </div>
                </div>
                <Progress value={tender.progressPercent || 0} className="h-2" />
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedTender(tender)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={!!selectedTender} onOpenChange={(open) => !open && setSelectedTender(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-2xl">
          {selectedTender && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTender.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Project Progress</h4>
                  <div className="flex items-center gap-4 mb-2">
                    <Progress value={selectedTender.progressPercent || 0} className="flex-1 h-3" />
                    <span className="text-lg font-semibold text-primary">{selectedTender.progressPercent || 0}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current: {selectedTender.currentMilestone}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Signature Chain</h4>
                  <div className="space-y-2">
                    {Array.from({ length: selectedTender.signaturesTotal || 0 }).map((_, idx) => {
                      const isSigned = idx < (selectedTender.signaturesCompleted || 0)
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            isSigned ? "bg-green-50 border-green-200" : "bg-muted border-border"
                          }`}
                        >
                          {isSigned ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Signatory {idx + 1}</p>
                            <p className="text-xs text-muted-foreground">{isSigned ? "Signed" : "Pending signature"}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {escrowLogs && escrowLogs.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Escrow Log</h4>
                    <div className="space-y-3">
                      {escrowLogs.map((log) => (
                        <div
                          key={log.id}
                          className={`p-4 rounded-lg border ${
                            log.status === "Released"
                              ? "bg-green-50 border-green-200"
                              : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">{log.milestone}</p>
                            <Badge variant={log.status === "Released" ? "success" : "secondary"}>{log.status}</Badge>
                          </div>
                          <p className="text-lg font-semibold mb-2">{formatCurrency(log.amount)}</p>
                          <div className="text-xs text-muted-foreground">
                            <p>Signatures: {log.signatures.length}/3</p>
                            {log.releasedAt && (
                              <p className="mt-1">Released: {new Date(log.releasedAt).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Escrow funds are automatically released upon milestone verification and
                    completion of the signature chain. No manual payment actions are required.
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
