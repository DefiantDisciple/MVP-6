"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

type UploadTenderModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (tender: {
    title: string
    postedDate: Date
    closingDate: Date
    clarificationCutoff: Date
  }) => void
}

export function UploadTenderModal({ open, onOpenChange, onSubmit }: UploadTenderModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [clarificationCutoff, setClarificationCutoff] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !closingDate || !clarificationCutoff) {
      return
    }

    onSubmit({
      title,
      postedDate: new Date(),
      closingDate: new Date(closingDate),
      clarificationCutoff: new Date(clarificationCutoff),
    })

    // Reset form
    setTitle("")
    setDescription("")
    setClosingDate("")
    setClarificationCutoff("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Tender</DialogTitle>
          <DialogDescription>Add a new tender with deadline and clarification cutoff dates</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tender Title</Label>
              <Input
                id="title"
                placeholder="Enter tender title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the tender requirements"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clarification-cutoff">Clarifications Cutoff Date</Label>
              <Input
                id="clarification-cutoff"
                type="datetime-local"
                value={clarificationCutoff}
                onChange={(e) => setClarificationCutoff(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Last date for vendors to request clarifications</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="closing-date">Closing Date</Label>
              <Input
                id="closing-date"
                type="datetime-local"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Final submission deadline for tender bids</p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">Upload tender documents (PDF, DOCX)</p>
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Tender</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
