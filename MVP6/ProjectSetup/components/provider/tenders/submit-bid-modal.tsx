"use client"

import type React from "react"

import { useState } from "react"
import { Upload, CheckCircle2, AlertCircle } from "lucide-react"
import type { Tender, Receipt } from "@/types/tender"
import { generateFileSHA256 } from "@/lib/crypto-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface SubmitBidModalProps {
  tender: Tender
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SubmitBidModal({ tender, open, onOpenChange, onSuccess }: SubmitBidModalProps) {
  const [technicalFile, setTechnicalFile] = useState<File | null>(null)
  const [financialFile, setFinancialFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipts, setReceipts] = useState<Receipt[] | null>(null)
  const { toast } = useToast()

  const handleTechnicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setTechnicalFile(file)
    } else {
      toast({
        title: "Invalid file",
        description: "Technical proposal must be a PDF file.",
        variant: "destructive",
      })
    }
  }

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setFinancialFile(file)
    } else {
      toast({
        title: "Invalid file",
        description: "Financial proposal must be a PDF file.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!technicalFile || !financialFile) {
      toast({
        title: "Missing files",
        description: "Both technical and financial proposals are required.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Generate SHA-256 hashes
      const [technicalHash, financialHash] = await Promise.all([
        generateFileSHA256(technicalFile),
        generateFileSHA256(financialFile),
      ])

      // Submit to API
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          providerId: "PROV-123", // Mock provider ID
          tenderTitle: tender.title,
          technicalHash,
          financialHash,
        }),
      })

      if (!response.ok) throw new Error("Submission failed")

      const data = await response.json()
      setReceipts(data.receipts)

      setTimeout(() => {
        onSuccess()
        resetForm()
      }, 2000)
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting your bid.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTechnicalFile(null)
    setFinancialFile(null)
    setIsSubmitting(false)
    setReceipts(null)
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
          <DialogTitle>Submit Bid</DialogTitle>
          <DialogDescription>{tender.title}</DialogDescription>
        </DialogHeader>

        {!receipts ? (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You must upload exactly two PDF files: technical proposal and financial proposal. Both files are
                required to submit your bid.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Technical Proposal (PDF) *</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleTechnicalChange}
                    className="hidden"
                    id="technical-upload"
                  />
                  <label htmlFor="technical-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">Choose File</span>
                    </Button>
                  </label>
                  {technicalFile && <p className="text-sm text-foreground mt-2 font-medium">{technicalFile.name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Financial Proposal (PDF) *</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFinancialChange}
                    className="hidden"
                    id="financial-upload"
                  />
                  <label htmlFor="financial-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">Choose File</span>
                    </Button>
                  </label>
                  {financialFile && <p className="text-sm text-foreground mt-2 font-medium">{financialFile.name}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!technicalFile || !financialFile || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Bid"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
              <div>
                <h3 className="font-semibold text-lg">Bid Submitted Successfully</h3>
                <p className="text-sm text-muted-foreground">Your receipts have been generated</p>
              </div>
            </div>

            <div className="space-y-4">
              {receipts.map((receipt, idx) => (
                <div key={idx} className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{receipt.documentType} Proposal</span>
                    {receipt.sealed && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">SEALED</span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground break-all">SHA-256: {receipt.sha256}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploaded: {new Date(receipt.uploadedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
