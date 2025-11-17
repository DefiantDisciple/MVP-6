"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { Dispute, DisputeStatus } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DisputesPanel() {
  const { toast } = useToast()
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false)
  const [pendingDecision, setPendingDecision] = useState<"Upheld" | "Rejected" | null>(null)

  const { data: disputes, error, isLoading, mutate } = useSWR<Dispute[]>("/api/disputes", fetcher)

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute)
    setDrawerOpen(true)
  }

  const handleSetDecision = (decision: "Upheld" | "Rejected") => {
    setPendingDecision(decision)
    setDecisionDialogOpen(true)
  }

  const confirmDecision = async () => {
    if (!selectedDispute || !pendingDecision) return

    try {
      const response = await fetch("/api/disputes/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disputeId: selectedDispute.id,
          decision: pendingDecision,
        }),
      })

      if (!response.ok) throw new Error("Failed to set decision")

      const result = await response.json()

      toast({
        title: "Decision Recorded",
        description: `Dispute ${selectedDispute.id} has been resolved as ${pendingDecision}`,
      })

      // Refresh disputes list
      mutate()

      // Update selected dispute
      if (selectedDispute) {
        setSelectedDispute({
          ...selectedDispute,
          status: `Resolved - ${pendingDecision}` as DisputeStatus,
        })
      }

      setDecisionDialogOpen(false)
      setPendingDecision(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record decision. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: DisputeStatus) => {
    if (status.startsWith("Resolved - Upheld")) return "bg-green-500"
    if (status.startsWith("Resolved - Rejected")) return "bg-red-500"
    if (status === "Under Review") return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getSLAColor = (days: number) => {
    if (days <= 2) return "text-destructive"
    if (days <= 5) return "text-orange-500"
    return "text-muted-foreground"
  }

  const isResolved = (status: DisputeStatus) => status.startsWith("Resolved")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{disputes?.filter((d) => d.status === "Pending").length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl">
              {disputes?.filter((d) => d.status === "Under Review").length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resolved - Upheld</CardDescription>
            <CardTitle className="text-3xl">
              {disputes?.filter((d) => d.status === "Resolved - Upheld").length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resolved - Rejected</CardDescription>
            <CardTitle className="text-3xl">
              {disputes?.filter((d) => d.status === "Resolved - Rejected").length || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Disputes Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dispute Queue</CardTitle>
          <CardDescription>{isLoading ? "Loading..." : `${disputes?.length || 0} dispute case(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load disputes</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}

          {disputes && disputes.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Tender</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Filed On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-balance">{dispute.tenderTitle}</div>
                      </TableCell>
                      <TableCell>{dispute.provider}</TableCell>
                      <TableCell>{formatDate(dispute.filedOn)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`flex items-center gap-1 ${getSLAColor(dispute.slaRemaining)}`}>
                          <Clock className="h-4 w-4" />
                          {dispute.slaRemaining} days
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDispute(dispute)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {disputes && disputes.length === 0 && !isLoading && (
            <div className="py-8 text-center text-muted-foreground">No disputes found</div>
          )}
        </CardContent>
      </Card>

      {/* Dispute Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selectedDispute && (
            <>
              <SheetHeader>
                <SheetTitle>Case {selectedDispute.id}</SheetTitle>
                <SheetDescription>
                  Filed by {selectedDispute.provider} on {formatDate(selectedDispute.filedOn)}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Case Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Case Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Case ID:</span>
                      <span className="font-mono">{selectedDispute.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tender:</span>
                      <span className="text-balance text-right">{selectedDispute.tenderTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span>{selectedDispute.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Filed On:</span>
                      <span>{formatDate(selectedDispute.filedOn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedDispute.status)}>{selectedDispute.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SLA Remaining:</span>
                      <span className={getSLAColor(selectedDispute.slaRemaining)}>
                        {selectedDispute.slaRemaining} business days
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Filing Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Original Filing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">Reason</div>
                      <div className="rounded-md bg-muted p-3 text-sm">
                        {selectedDispute.reason ||
                          "The provider disputes the evaluation outcome and believes their technical proposal met all requirements. They request a re-evaluation of the scoring methodology used."}
                      </div>
                    </div>

                    {selectedDispute.attachments && selectedDispute.attachments.length > 0 && (
                      <div>
                        <div className="mb-2 text-sm font-medium">Attachments</div>
                        <div className="space-y-1">
                          {selectedDispute.attachments.map((attachment, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Decision Controls */}
                {!isResolved(selectedDispute.status) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Set Decision</CardTitle>
                      <CardDescription>
                        This action will publish the outcome to the entity and provider, and append an audit event.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Button className="flex-1" variant="default" onClick={() => handleSetDecision("Upheld")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Uphold
                        </Button>
                        <Button className="flex-1" variant="destructive" onClick={() => handleSetDecision("Rejected")}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Resolution Notice */}
                {isResolved(selectedDispute.status) && (
                  <Card className="border-green-500">
                    <CardHeader>
                      <CardTitle className="text-base text-green-600">Case Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This dispute has been resolved as {selectedDispute.status.replace("Resolved - ", "")}. The
                        outcome has been published to all parties and recorded in the audit log.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Decision Confirmation Dialog */}
      <AlertDialog open={decisionDialogOpen} onOpenChange={setDecisionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Decision</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this dispute as {pendingDecision}? This action will publish the outcome to
              the entity and provider, and create an immutable audit event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDecision(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDecision}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
