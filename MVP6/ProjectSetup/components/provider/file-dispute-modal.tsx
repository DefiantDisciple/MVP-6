"use client"

import * as React from "react"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface FileDisputeModalProps {
  tenderId: string
  tenderTitle: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function FileDisputeModal({ tenderId, tenderTitle, open, onClose, onSuccess }: FileDisputeModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    reason: "",
    details: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId,
          providerName: "BuildCorp Services Ltd",
          reason: formData.reason,
          details: formData.details,
          evidenceUrls: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to file dispute")

      toast({
        title: "Dispute Filed",
        description: "Your dispute has been submitted for review",
      })

      setFormData({ reason: "", details: "" })
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to file dispute",
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
          <ModalTitle>File Dispute</ModalTitle>
          <ModalDescription>{tenderTitle}</ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Dispute Reason *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Evaluation Score Discrepancy"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Detailed Explanation *</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Provide a detailed explanation of your dispute..."
              rows={6}
              required
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Your dispute will be reviewed by the platform administrators. You will be notified of the outcome.
            </p>
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Filing..." : "File Dispute"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
