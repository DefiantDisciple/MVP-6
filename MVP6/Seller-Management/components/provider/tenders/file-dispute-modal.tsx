"use client"

import type React from "react"

import { useState } from "react"
import { Upload, CheckCircle2 } from "lucide-react"
import type { Tender } from "@/types/tender"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FileDisputeModalProps {
  tender: Tender
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function FileDisputeModal({ tender, open, onOpenChange, onSuccess }: FileDisputeModalProps) {
  const [reason, setReason] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for your dispute.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          tenderTitle: tender.title,
          providerId: "PROV-123",
          reason,
          attachments: attachments.map((f) => ({ name: f.name, url: "#" })),
        }),
      })

      if (!response.ok) throw new Error("Failed to file dispute")

      const data = await response.json()
      setCaseId(data.caseId)

      toast({
        title: "Dispute filed successfully",
        description: `Case ID: ${data.caseId}`,
      })

      setTimeout(() => {
        onSuccess()
        resetForm()
      }, 2000)
    } catch (error) {
      toast({
        title: "Failed to file dispute",
        description: "An error occurred while filing your dispute.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setReason("")
    setAttachments([])
    setIsSubmitting(false)
    setCaseId(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetForm()
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>File Dispute</DialogTitle>
          <DialogDescription>{tender.title}</DialogDescription>
        </DialogHeader>

        {!caseId ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Reason for Dispute *</label>
              <Textarea
                placeholder="Explain why you believe the award decision should be reviewed..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Supporting Documents (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <input type="file" multiple onChange={handleFileChange} className="hidden" id="dispute-attachments" />
                <label htmlFor="dispute-attachments">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">Choose Files</span>
                  </Button>
                </label>
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {attachments.map((file, idx) => (
                      <p key={idx} className="text-sm text-foreground">
                        {file.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!reason.trim() || isSubmitting}>
                {isSubmitting ? "Filing..." : "File Dispute"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
              <div>
                <h3 className="font-semibold text-lg">Dispute Filed Successfully</h3>
                <p className="text-sm text-muted-foreground">Case ID: {caseId}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your dispute has been submitted and will be reviewed by the relevant authorities. You can track the status
              of your dispute in the "My Disputes" tab.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
