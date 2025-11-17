"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/ui/status-pill"
import { ProgressBar } from "@/components/ui/progress-bar"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { Milestone } from "@/lib/types"

interface MilestoneTimelineProps {
  milestones: Milestone[]
  onApproveMilestone?: (milestoneId: string) => void
}

export function MilestoneTimeline({ milestones, onApproveMilestone }: MilestoneTimelineProps) {
  const sortedMilestones = [...milestones].sort((a, b) => a.sequence - b.sequence)
  const completedCount = sortedMilestones.filter((m) => m.status === "paid" || m.status === "approved").length
  const progress = (completedCount / sortedMilestones.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Milestones</CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedCount} of {sortedMilestones.length} completed
          </div>
        </div>
        <ProgressBar value={progress} showLabel className="mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => {
            const isCompleted = milestone.status === "paid" || milestone.status === "approved"
            const isCurrent = milestone.status === "in_progress" || milestone.status === "submitted"
            const isPending = milestone.status === "pending"

            return (
              <div key={milestone.id} className="relative">
                {/* Timeline connector */}
                {index < sortedMilestones.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                      <StatusPill status={milestone.status} />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{formatCurrency(milestone.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{formatDate(milestone.dueDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sequence</p>
                        <p className="font-medium">Milestone {milestone.sequence}</p>
                      </div>
                    </div>

                    {milestone.status === "submitted" && onApproveMilestone && (
                      <div className="mt-4">
                        <Button onClick={() => onApproveMilestone(milestone.id)} size="sm">
                          Approve Milestone
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
