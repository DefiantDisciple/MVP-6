"use client"

import { useState } from "react"
import useSWR from "swr"
import { Eye, Download, Upload, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate, getCountdown } from "@/lib/formatters"
import type { Tender } from "@/lib/types"
import TenderDetailDrawer from "./tender-detail-drawer"
import UploadTenderModal from "./upload-tender-modal"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function OpenPanel() {
  const { data: tenders, isLoading, mutate } = useSWR<Tender[]>("/api/tenders?stage=open", fetcher)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Open Tenders</h2>
        <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Tender
        </Button>
      </div>

      <Card className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tender</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Posted</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Closes</th>
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
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(tender.postedDate)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-warning" />
                        <span className="font-medium text-warning">{getCountdown(tender.closingTime)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{tender.submissions}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                        {tender.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTender(tender)}
                          className="gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Stub download
                            console.log("Download bids summary", tender.id)
                          }}
                          className="gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No open tenders at this time
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTender && (
        <TenderDetailDrawer tender={selectedTender} open={!!selectedTender} onClose={() => setSelectedTender(null)} />
      )}

      <UploadTenderModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          mutate()
          setUploadModalOpen(false)
        }}
      />
    </>
  )
}
