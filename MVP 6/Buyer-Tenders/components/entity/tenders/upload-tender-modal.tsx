"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface UploadTenderModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UploadTenderModal({ open, onClose, onSuccess }: UploadTenderModalProps) {
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)
      // Stub upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Tender Uploaded",
        description: "The tender has been successfully published",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload tender",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-lg border border-border z-50">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Upload Tender</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tender Title</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closingDate">Closing Date</Label>
              <Input id="closingDate" name="closingDate" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clarificationCutoff">Clarification Cutoff</Label>
              <Input id="clarificationCutoff" name="clarificationCutoff" type="datetime-local" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Tender Document</Label>
            <Input id="file" name="file" type="file" required />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} className="gap-2">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Tender"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
