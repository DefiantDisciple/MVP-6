"use client"

import useSWR from "swr"
import { useState } from "react"
import { Eye, FileText } from "lucide-react"
import type { Tender } from "@/types/tender"
import { formatDate, getCountdown } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SubmitBidModal } from "./submit-bid-modal"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function OpenTendersPanel() {
  const { data: tenders, isLoading } = useSWR<Tender[]>("/api/tenders?stage=open", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const { toast } = useToast()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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
        <p className="text-muted-foreground">No open tenders available at this time.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {tenders.map((tender) => (
          <Card key={tender.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground mb-2">{tender.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Posted:</span>
                    <p className="font-medium">{formatDate(tender.postedDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Closes:</span>
                    <p className="font-medium text-destructive">{getCountdown(tender.closingDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium">{tender.category}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Procuring Entity:</span>
                    <p className="font-medium">{tender.procuringEntity}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedTender(tender)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedTender(tender)
                    setShowSubmitModal(true)
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Bid
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Tender Drawer */}
      <Sheet open={!!selectedTender && !showSubmitModal} onOpenChange={(open) => !open && setSelectedTender(null)}>
        <SheetContent className="overflow-y-auto bg-white p-6">
          {selectedTender && (
            <>
              <SheetHeader className="pb-4 border-b border-gray-200">
                <SheetTitle className="text-xl font-semibold text-gray-900">{selectedTender.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6 text-gray-900">
                <div>
                  <h4 className="font-medium mb-2 text-gray-900">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedTender.description || "No description available."}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-900">Key Dates</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Posted:</dt>
                      <dd className="font-medium text-gray-900">{formatDate(selectedTender.postedDate)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Closing Date:</dt>
                      <dd className="font-medium text-gray-900">{formatDate(selectedTender.closingDate)}</dd>
                    </div>
                    {selectedTender.clarificationsCutoff && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Clarifications Cutoff:</dt>
                        <dd className="font-medium text-gray-900">{formatDate(selectedTender.clarificationsCutoff)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                {selectedTender.attachments && selectedTender.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Attachments</h4>
                    <div className="space-y-2">
                      {selectedTender.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowSubmitModal(true)}>
                  Submit Bid
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Submit Bid Modal */}
      {selectedTender && (
        <SubmitBidModal
          tender={selectedTender}
          open={showSubmitModal}
          onOpenChange={setShowSubmitModal}
          onSuccess={() => {
            toast({
              title: "Bid submitted successfully",
              description: "Your bid has been recorded with SHA-256 receipts.",
            })
            setShowSubmitModal(false)
            setSelectedTender(null)
          }}
        />
      )}
    </>
  )
}
