"use client"

import useSWR from "swr"
import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import type { Tender, Clarification } from "@/types/tender"
import { formatDate } from "@/lib/format-utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ClarificationsPanel() {
  const { data: tenders } = useSWR<Tender[]>("/api/tenders?stage=open", fetcher)
  const [selectedTenderId, setSelectedTenderId] = useState<string>("")
  const {
    data: clarifications,
    isLoading,
    mutate,
  } = useSWR<Clarification[]>(selectedTenderId ? `/api/clarifications?tid=${selectedTenderId}` : null, fetcher)
  const [newQuestion, setNewQuestion] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const { toast } = useToast()

  const selectedTender = tenders?.find((t) => t.id === selectedTenderId)
  const isPastCutoff = selectedTender?.clarificationsCutoff
    ? new Date() > new Date(selectedTender.clarificationsCutoff)
    : false

  const handlePostQuestion = async () => {
    if (!newQuestion.trim() || !selectedTenderId) return

    setIsPosting(true)
    try {
      const response = await fetch("/api/clarifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: selectedTenderId,
          question: newQuestion,
          askedBy: "PROV-123",
        }),
      })

      if (!response.ok) throw new Error("Failed to post question")

      toast({
        title: "Question posted",
        description: "Your clarification request has been submitted.",
      })

      setNewQuestion("")
      mutate()
    } catch (error) {
      toast({
        title: "Failed to post question",
        description: "An error occurred while posting your question.",
        variant: "destructive",
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <label className="block text-sm font-medium mb-2">Select Tender</label>
        <Select value={selectedTenderId} onValueChange={setSelectedTenderId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a tender to view clarifications" />
          </SelectTrigger>
          <SelectContent>
            {tenders?.map((tender) => (
              <SelectItem key={tender.id} value={tender.id}>
                {tender.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {selectedTenderId && (
        <>
          {!isPastCutoff && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Post a Question
              </h3>
              <Textarea
                placeholder="Ask a question about this tender..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Clarifications cutoff:{" "}
                  {selectedTender?.clarificationsCutoff ? formatDate(selectedTender.clarificationsCutoff) : "N/A"}
                </p>
                <Button onClick={handlePostQuestion} disabled={!newQuestion.trim() || isPosting}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Question
                </Button>
              </div>
            </Card>
          )}

          {isPastCutoff && (
            <Card className="p-6 bg-muted">
              <p className="text-sm text-muted-foreground">
                The clarifications period has ended for this tender. You can view existing clarifications below.
              </p>
            </Card>
          )}

          <div>
            <h3 className="font-semibold mb-4">Questions & Answers</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </Card>
                ))}
              </div>
            ) : clarifications && clarifications.length > 0 ? (
              <div className="space-y-4">
                {clarifications.map((clarification) => (
                  <Card key={clarification.id} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-full p-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm mb-1">Question</p>
                            <p className="text-sm text-foreground leading-relaxed">{clarification.question}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Asked on {formatDate(clarification.askedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {clarification.answer ? (
                        <div className="pl-11 border-l-2 border-primary/20 ml-5">
                          <p className="font-medium text-sm mb-1 text-primary">Answer</p>
                          <p className="text-sm text-foreground leading-relaxed">{clarification.answer}</p>
                          {clarification.answeredAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Answered on {formatDate(clarification.answeredAt)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="pl-11 ml-5">
                          <p className="text-sm text-muted-foreground italic">
                            Awaiting response from procuring entity...
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No clarifications have been posted for this tender yet.</p>
              </Card>
            )}
          </div>
        </>
      )}

      {!selectedTenderId && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Select a tender above to view or post clarifications.</p>
        </Card>
      )}
    </div>
  )
}
