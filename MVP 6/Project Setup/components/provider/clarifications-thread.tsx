"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Clarification } from "@/lib/types"

interface ClarificationsThreadProps {
  tenderId: string
  clarifications: Clarification[]
  allowNew: boolean
  onNewClarification?: () => void
}

export function ClarificationsThread({
  tenderId,
  clarifications,
  allowNew,
  onNewClarification,
}: ClarificationsThreadProps) {
  const { toast } = useToast()
  const [question, setQuestion] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/clarifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId,
          providerName: "BuildCorp Services Ltd",
          question: question.trim(),
          isPublic: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit clarification")

      toast({
        title: "Clarification Submitted",
        description: "Your question has been sent to the entity",
      })

      setQuestion("")
      onNewClarification?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit clarification",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Clarifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clarifications List */}
        <div className="space-y-4">
          {clarifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No clarifications yet</div>
          ) : (
            clarifications.map((clarif) => (
              <div key={clarif.id} className="border border-border rounded-lg p-4 space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{clarif.providerName || "Anonymous"}</p>
                      {clarif.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDateTime(clarif.askedAt)}</p>
                  </div>
                  <p className="text-sm">{clarif.question}</p>
                </div>

                {clarif.answer ? (
                  <div className="pl-4 border-l-2 border-primary bg-muted/30 p-3 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Response • {clarif.answeredAt ? formatDateTime(clarif.answeredAt) : ""}
                    </p>
                    <p className="text-sm">{clarif.answer}</p>
                  </div>
                ) : (
                  <div className="pl-4">
                    <Badge variant="secondary" className="text-xs">
                      Awaiting Response
                    </Badge>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* New Clarification Form */}
        {allowNew ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a clarification question..."
              rows={3}
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !question.trim()} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Clarification period has ended</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
