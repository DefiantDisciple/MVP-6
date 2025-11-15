"use client"

import { X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatters"
import type { Tender } from "@/lib/types"

interface TenderDetailDrawerProps {
  tender: Tender
  open: boolean
  onClose: () => void
}

export default function TenderDetailDrawer({ tender, open, onClose }: TenderDetailDrawerProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Tender Details</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tender.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">ID: {tender.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Posted Date</p>
              <p className="text-sm text-foreground mt-1">{formatDate(tender.postedDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Closing Date</p>
              <p className="text-sm text-foreground mt-1">{formatDate(tender.closingTime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submissions</p>
              <p className="text-sm text-foreground mt-1">{tender.submissions}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-sm text-foreground mt-1">{tender.status}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Documents</h4>
            <div className="space-y-2">
              {tender.documents && tender.documents.length > 0 ? (
                tender.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} • {formatDate(doc.uploadDate)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No documents available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
