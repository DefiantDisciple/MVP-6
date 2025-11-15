"use client"

import useSWR from "swr"
import { useState } from "react"
import { Eye, AlertCircle } from "lucide-react"
import type { Dispute } from "@/types/tender"
import { formatDate } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Pending":
      return "secondary"
    case "Under Review":
      return "default"
    case "Resolved - Upheld":
      return "success"
    case "Resolved - Rejected":
      return "destructive"
    default:
      return "outline"
  }
}

export function MyDisputesPanel() {
  const { data: disputesResponse, isLoading } = useSWR<any>("/api/disputes?providerId=PROV-123", fetcher)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  
  // Extract disputes array from response (handle both array and object formats)
  const disputes = disputesResponse?.disputes || disputesResponse || []

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

  if (!disputes || disputes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">You have not filed any disputes.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {disputes.map((dispute) => (
          <Card key={dispute.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {dispute.caseId}
                  </Badge>
                  <Badge variant={getStatusVariant(dispute.status)}>{dispute.status}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{dispute.tenderTitle}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Filed On:</span>
                    <p className="font-medium">{formatDate(dispute.filedAt)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tender ID:</span>
                    <p className="font-medium">{dispute.tenderId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium">{dispute.status}</p>
                  </div>
                </div>
                {dispute.decisionSummary && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Decision Summary:</span>
                    <p className="text-sm mt-1 leading-relaxed">{dispute.decisionSummary}</p>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedDispute(dispute)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={!!selectedDispute} onOpenChange={(open) => !open && setSelectedDispute(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedDispute && (
            <>
              <SheetHeader>
                <SheetTitle>Dispute Details</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="font-mono">
                      {selectedDispute.caseId}
                    </Badge>
                    <Badge variant={getStatusVariant(selectedDispute.status)}>{selectedDispute.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{selectedDispute.tenderTitle}</h3>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Case Information</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Case ID:</dt>
                      <dd className="font-mono">{selectedDispute.caseId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tender ID:</dt>
                      <dd className="font-medium">{selectedDispute.tenderId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Filed On:</dt>
                      <dd className="font-medium">{formatDate(selectedDispute.filedAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status:</dt>
                      <dd className="font-medium">{selectedDispute.status}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Reason for Dispute</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedDispute.reason}</p>
                  </div>
                </div>

                {selectedDispute.attachments && selectedDispute.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Supporting Documents</h4>
                    <div className="space-y-2">
                      {selectedDispute.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-muted"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDispute.decisionSummary && (
                  <div>
                    <h4 className="font-medium mb-2">Decision Summary</h4>
                    <div
                      className={`p-4 rounded-lg border ${
                        selectedDispute.status === "Resolved - Upheld"
                          ? "bg-green-50 border-green-200"
                          : selectedDispute.status === "Resolved - Rejected"
                            ? "bg-red-50 border-red-200"
                            : "bg-muted border-border"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{selectedDispute.decisionSummary}</p>
                    </div>
                  </div>
                )}

                {selectedDispute.status === "Under Review" && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      Your dispute is currently under review by the relevant authorities. You will be notified once a
                      decision has been made.
                    </p>
                  </div>
                )}

                {selectedDispute.status === "Pending" && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-900">
                      Your dispute has been filed and is awaiting initial review.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
