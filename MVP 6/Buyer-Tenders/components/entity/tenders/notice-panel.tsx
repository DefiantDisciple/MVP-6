"use client"
import useSWR from "swr"
import { Clock, CheckCircle, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatCurrency, businessDaysLeft } from "@/lib/formatters"
import type { Tender, Dispute } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function NoticePanel() {
  const { data: tenders, isLoading, mutate } = useSWR<Tender[]>("/api/tenders?stage=notice", fetcher)
  const { toast } = useToast()

  const checkDisputesAndConfirm = async (tender: Tender) => {
    try {
      const disputes = await fetch(`/api/disputes?tid=${tender.id}`).then((r) => r.json())
      const unresolvedDisputes = disputes.filter((d: Dispute) => d.status === "pending")

      if (unresolvedDisputes.length > 0) {
        toast({
          title: "Cannot Confirm Award",
          description: "There are unresolved disputes for this tender",
          variant: "destructive",
        })
        return
      }

      // Confirm award
      await fetch("/api/awards/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenderId: tender.id }),
      })

      toast({
        title: "Award Confirmed",
        description: "Tender moved to Awarded stage",
      })
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm award",
        variant: "destructive",
      })
    }
  }

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
        <h2 className="text-xl font-semibold text-foreground">Notice to Award</h2>
        <p className="text-sm text-muted-foreground mt-1">10 business-day standstill period for challenges</p>
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tender</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Preferred Provider</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Est. Value</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Notice Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Challenge Window</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenders && tenders.length > 0 ? (
                tenders.map((tender) => {
                  const daysLeft = businessDaysLeft(tender.noticeDate!, 10)
                  const isExpired = daysLeft === 0

                  return (
                    <tr key={tender.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{tender.title}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{tender.preferredProvider}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatCurrency(tender.estimatedValue || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(tender.noticeDate!)}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {isExpired ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Clock className="h-4 w-4 text-warning" />
                          )}
                          <span className={isExpired ? "text-success font-medium" : "text-warning font-medium"}>
                            {isExpired ? "Expired" : `${daysLeft} days`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            tender.status === "Under Review"
                              ? "bg-warning/10 text-warning"
                              : isExpired
                                ? "bg-success/10 text-success"
                                : "bg-info/10 text-info"
                          }`}
                        >
                          {tender.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => checkDisputesAndConfirm(tender)} disabled={!isExpired}>
                            Confirm Award
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Notifications Sent</DropdownMenuItem>
                              <DropdownMenuItem>View Disputes</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No tenders in notice period
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
