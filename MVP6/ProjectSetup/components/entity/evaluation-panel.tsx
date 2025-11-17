"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Star, Award } from "lucide-react"
import type { VendorBid } from "@/lib/types"

interface EvaluationPanelProps {
  bid: VendorBid
  onSave: (scores: any) => void
  onSetPreferred: () => void
}

export function EvaluationPanel({ bid, onSave, onSetPreferred }: EvaluationPanelProps) {
  const [scores, setScores] = React.useState({
    technicalScore: bid.technicalScore || 0,
    financialScore: bid.financialScore || 0,
    comments: "",
  })

  const totalScore = scores.technicalScore * 0.6 + scores.financialScore * 0.4

  const handleSave = () => {
    onSave({
      ...scores,
      totalScore,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {bid.providerName}
              {bid.isPreferred && (
                <Badge variant="default" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Preferred
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Bid ID: {bid.id}</CardDescription>
          </div>
          {!bid.isPreferred && (
            <Button variant="outline" size="sm" onClick={onSetPreferred}>
              <Award className="h-4 w-4 mr-2" />
              Set as Preferred
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Documents */}
        <div>
          <h4 className="font-semibold mb-3">Submitted Documents</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <a
              href={bid.technicalProposalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <p className="text-sm font-medium mb-1">Technical Proposal</p>
              <p className="text-xs text-muted-foreground truncate">{bid.technicalProposalHash}</p>
            </a>
            <a
              href={bid.financialProposalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <p className="text-sm font-medium mb-1">Financial Proposal</p>
              <p className="text-xs text-muted-foreground truncate">{bid.financialProposalHash}</p>
            </a>
          </div>
        </div>

        {/* Scoring */}
        <div className="space-y-4">
          <h4 className="font-semibold">Evaluation Scores</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`tech-${bid.id}`}>Technical Score (60%)</Label>
              <span className="text-sm font-medium">{scores.technicalScore}/100</span>
            </div>
            <Input
              id={`tech-${bid.id}`}
              type="number"
              min="0"
              max="100"
              value={scores.technicalScore}
              onChange={(e) => setScores({ ...scores, technicalScore: Number(e.target.value) })}
            />
            <ProgressBar value={scores.technicalScore} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`fin-${bid.id}`}>Financial Score (40%)</Label>
              <span className="text-sm font-medium">{scores.financialScore}/100</span>
            </div>
            <Input
              id={`fin-${bid.id}`}
              type="number"
              min="0"
              max="100"
              value={scores.financialScore}
              onChange={(e) => setScores({ ...scores, financialScore: Number(e.target.value) })}
            />
            <ProgressBar value={scores.financialScore} />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Weighted Score</span>
              <span className="text-2xl font-bold">{totalScore.toFixed(1)}/100</span>
            </div>
            <ProgressBar value={totalScore} showLabel={false} className="mt-2" />
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <Label htmlFor={`comments-${bid.id}`}>Evaluation Comments</Label>
          <Textarea
            id={`comments-${bid.id}`}
            value={scores.comments}
            onChange={(e) => setScores({ ...scores, comments: e.target.value })}
            placeholder="Add your evaluation notes and feedback..."
            rows={4}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Evaluation
        </Button>
      </CardContent>
    </Card>
  )
}
