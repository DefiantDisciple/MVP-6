"use client"

import * as React from "react"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { hashFileMock } from "@/lib/utils"
import type { Tender } from "@/lib/types"

interface SubmitBidModalProps {
  tender: Tender
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SubmitBidModal({ tender, open, onClose, onSuccess }: SubmitBidModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [files, setFiles] = React.useState<{
    technical: File | null
    financial: File | null
  }>({
    technical: null,
    financial: null,
  })

  const handleFileChange = (type: "technical" | "financial", file: File | null) => {
    if (file && file.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed",
        variant: "destructive",
      })
      return
    }
    setFiles((prev) => ({ ...prev, [type]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!files.technical || !files.financial) {
      toast({
        title: "Missing Documents",
        description: "Both technical and financial proposals are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate file hashes
      const technicalHash = await hashFileMock(files.technical)
      const financialHash = await hashFileMock(files.financial)

      // In a real app, upload files to storage first
      const technicalUrl = `/submissions/technical-${Date.now()}.pdf`
      const financialUrl = `/submissions/financial-${Date.now()}.pdf`

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          providerName: "BuildCorp Services Ltd",
          technicalProposalUrl: technicalUrl,
          financialProposalUrl: financialUrl,
          technicalProposalHash: technicalHash,
          financialProposalHash: financialHash,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit bid")

      const data = await response.json()

      toast({
        title: "Bid Submitted Successfully",
        description: `Receipt Number: ${data.receipt.receiptNumber}`,
        variant: "default",
      })

      setFiles({ technical: null, financial: null })
      onSuccess()
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Submit Bid</ModalTitle>
          <ModalDescription>{tender.title}</ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Important Requirements</p>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>• Exactly 2 PDF files required (Technical and Financial proposals)</li>
                  <li>• Files will be cryptographically hashed for integrity verification</li>
                  <li>• Bids are sealed until the evaluation period</li>
                  <li>• You will receive a timestamped receipt upon submission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Proposal */}
          <div className="space-y-2">
            <Label htmlFor="technical">Technical Proposal (PDF) *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                id="technical"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange("technical", e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="technical" className="cursor-pointer">
                {files.technical ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{files.technical.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleFileChange("technical", null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium mb-1">Click to upload Technical Proposal</p>
                    <p className="text-sm text-muted-foreground">PDF only, max 50MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Financial Proposal */}
          <div className="space-y-2">
            <Label htmlFor="financial">Financial Proposal (PDF) *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                id="financial"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange("financial", e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="financial" className="cursor-pointer">
                {files.financial ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{files.financial.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        handleFileChange("financial", null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium mb-1">Click to upload Financial Proposal</p>
                    <p className="text-sm text-muted-foreground">PDF only, max 50MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !files.technical || !files.financial}>
              {isLoading ? "Submitting..." : "Submit Bid"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
