"use client"

import useSWR from "swr"
import { useState } from "react"
import { Eye, XCircle } from "lucide-react"
import type { Submission } from "@/types/tender"
import { formatDate } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MySubmissionsPanel() {
  const { data: submissions, isLoading, mutate } = useSWR<Submission[]>("/api/submissions?providerId=PROV-123", fetcher)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const { toast } = useToast()

  const handleWithdraw = async (submissionId: string) => {
    try {
      const response = await fetch("/api/submissions/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      })

      if (!response.ok) throw new Error("Withdrawal failed")

      toast({
        title: "Bid withdrawn",
        description: "Your submission has been withdrawn successfully.",
      })

      mutate()
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "An error occurred while withdrawing your bid.",
        variant: "destructive",
      })
    }
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

  if (!submissions || submissions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">You have not submitted any bids yet.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2">{submission.tenderTitle}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>
                    <p className="font-medium">{formatDate(submission.submittedAt)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Technical Hash:</span>
                    <p className="font-mono text-xs">{submission.technicalHash.substring(0, 16)}...</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Financial Hash:</span>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-xs">{submission.financialHash.substring(0, 16)}...</p>
                      {submission.financialSealed && (
                        <Badge variant="secondary" className="text-xs">
                          SEALED
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {submission.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Receipt
                </Button>
                {!submission.withdrawnAt && (
                  <Button variant="outline" size="sm" onClick={() => handleWithdraw(submission.id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Receipt Drawer */}
      <Sheet open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedSubmission && (
            <>
              <SheetHeader>
                <SheetTitle>Submission Receipt</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Tender</h4>
                  <p className="text-sm">{selectedSubmission.tenderTitle}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Submission Details</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Submitted:</dt>
                      <dd className="font-medium">{formatDate(selectedSubmission.submittedAt)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Status:</dt>
                      <dd className="font-medium">{selectedSubmission.status}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Document Hashes</h4>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Technical Proposal</span>
                      </div>
                      <p className="text-xs font-mono break-all">{selectedSubmission.technicalHash}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Financial Proposal</span>
                        {selectedSubmission.financialSealed && <Badge variant="secondary">SEALED</Badge>}
                      </div>
                      <p className="text-xs font-mono break-all">{selectedSubmission.financialHash}</p>
                    </div>
                  </div>
                </div>
                {selectedSubmission.auditLog && selectedSubmission.auditLog.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Audit Log</h4>
                    <div className="space-y-2">
                      {selectedSubmission.auditLog.map((event, idx) => (
                        <div key={idx} className="text-sm border-l-2 border-primary pl-3 py-1">
                          <p className="font-medium">{event.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(event.timestamp)} by {event.actor}
                          </p>
                        </div>
                      ))}
                    </div>
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
