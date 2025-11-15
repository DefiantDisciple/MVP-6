"use client"

import useSWR from "swr"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import type { Tender } from "@/types/tender"
import { formatDate, formatCurrency } from "@/lib/format-utils"
import { addBusinessDays, getBusinessDaysRemaining } from "@/lib/business-days"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileDisputeModal } from "./file-dispute-modal"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NoticeToAwardPanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=notice", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [showDisputeModal, setShowDisputeModal] = useState(false)

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
        <p className="text-muted-foreground">No notices to award at this time.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tenders.map((tender) => {
          const challengeEnd = tender.noticeDate ? addBusinessDays(new Date(tender.noticeDate), 10) : new Date()
          const daysRemaining = getBusinessDaysRemaining(challengeEnd)
          const canChallenge = daysRemaining > 0

          return (
            <Card key={tender.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{tender.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Preferred Provider:</span>
                      <p className="font-medium">{tender.preferredProvider}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contract Value:</span>
                      <p className="font-medium">
                        {tender.contractValue ? formatCurrency(tender.contractValue) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Notice Date:</span>
                      <p className="font-medium">{tender.noticeDate ? formatDate(tender.noticeDate) : "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Challenge Window:</span>
                      <p className="font-medium">
                        {canChallenge ? (
                          <span className="text-orange-600">{daysRemaining} business days</span>
                        ) : (
                          <span className="text-muted-foreground">Closed</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={canChallenge ? "default" : "secondary"}>
                        {canChallenge ? "Challengeable" : "Challenge Period Ended"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {canChallenge && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                    onClick={() => {
                      setSelectedTender(tender)
                      setShowDisputeModal(true)
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    File Dispute
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {selectedTender && (
        <FileDisputeModal
          tender={selectedTender}
          open={showDisputeModal}
          onOpenChange={setShowDisputeModal}
          onSuccess={() => {
            setShowDisputeModal(false)
            setSelectedTender(null)
          }}
        />
      )}
    </>
  )
}
