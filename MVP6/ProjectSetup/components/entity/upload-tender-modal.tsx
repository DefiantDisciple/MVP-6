"use client"

import * as React from "react"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addBusinessDays } from "@/lib/businessDays"

interface UploadTenderModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UploadTenderModal({ open, onClose, onSuccess }: UploadTenderModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    submissionDeadlineDays: "15",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const now = new Date()
      const submissionDeadline = addBusinessDays(now, Number.parseInt(formData.submissionDeadlineDays))
      const clarificationDeadline = addBusinessDays(
        now,
        Math.floor(Number.parseInt(formData.submissionDeadlineDays) / 2),
      )
      const evaluationDeadline = addBusinessDays(submissionDeadline, 7)

      const response = await fetch("/api/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: Number.parseFloat(formData.budget),
          currency: "BWP",
          submissionDeadline,
          clarificationDeadline,
          evaluationDeadline,
          publishedAt: now,
          documentUrls: [],
          requirements: [],
          allowClarifications: true,
          allowResubmissions: false,
        }),
      })

      if (!response.ok) throw new Error("Failed to create tender")

      toast({
        title: "Tender Created",
        description: "Your tender has been created successfully",
      })

      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        submissionDeadlineDays: "15",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tender",
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
          <ModalTitle>Create New Tender</ModalTitle>
          <ModalDescription>Publish a new tender for service providers to submit bids</ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tender Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Road Construction Project"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the tender requirements"
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Infrastructure"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (BWP) *</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g., 10000000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Submission Deadline (Business Days) *</Label>
            <Input
              id="deadline"
              type="number"
              value={formData.submissionDeadlineDays}
              onChange={(e) => setFormData({ ...formData, submissionDeadlineDays: e.target.value })}
              placeholder="e.g., 15"
              min="5"
              required
            />
            <p className="text-sm text-muted-foreground">Number of business days from now for bid submissions</p>
          </div>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Tender"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
