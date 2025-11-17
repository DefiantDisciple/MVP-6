"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface PerformanceData {
  published: number
  underEvaluation: number
  active: number
  completed: number
  avgCycleDays: number
  compliancePercentage: number
}

export function ProcurementPerformance() {
  const [data, setData] = useState<PerformanceData | null>(null)

  useEffect(() => {
    // Simulated API call to /api/tenders?aggregate=entity
    const fetchData = async () => {
      const mockData: PerformanceData = {
        published: 24,
        underEvaluation: 8,
        active: 12,
        completed: 156,
        avgCycleDays: 45,
        compliancePercentage: 96.5,
      }
      setData(mockData)
    }
    fetchData()
  }, [])

  if (!data) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Procurement Performance Snapshot</CardTitle>
            <p className="text-sm text-muted-foreground">Overview of tender activities</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Published</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.published}</p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Under Evaluation</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.underEvaluation}</p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Active</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.active}</p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <p className="text-xs font-medium text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.completed}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <p className="mb-1 text-sm font-medium text-muted-foreground">Avg Cycle Days</p>
            <p className="text-3xl font-bold text-foreground">{data.avgCycleDays}</p>
            <p className="text-xs text-muted-foreground">days per tender</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="mb-1 text-sm font-medium text-muted-foreground">Compliance Rate</p>
            <p className="text-3xl font-bold text-accent">{data.compliancePercentage}%</p>
            <p className="text-xs text-muted-foreground">regulatory compliance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
