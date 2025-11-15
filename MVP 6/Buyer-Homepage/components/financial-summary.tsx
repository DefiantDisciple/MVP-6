"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Lock, CheckCircle, Clock, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/format"

interface FinancialData {
  committedEscrow: number
  released: number
  pendingRelease: number
  lastDisbursement: {
    amount: number
    date: string
  }
}

export function FinancialSummary() {
  const [data, setData] = useState<FinancialData | null>(null)

  useEffect(() => {
    // Simulated API call to /api/escrow/logs?entityId=...
    const fetchData = async () => {
      const mockData: FinancialData = {
        committedEscrow: 12500000,
        released: 8750000,
        pendingRelease: 3750000,
        lastDisbursement: {
          amount: 450000,
          date: "2025-01-05T10:30:00Z",
        },
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
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Financial Summary</CardTitle>
            <p className="text-sm text-muted-foreground">Escrow and disbursement overview</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="rounded-lg border bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Committed (Escrow)</p>
            </div>
            <p className="text-3xl font-bold text-primary">P {data.committedEscrow.toLocaleString()}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-accent/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <p className="text-xs font-medium text-muted-foreground">Released</p>
              </div>
              <p className="text-xl font-bold text-accent">P {data.released.toLocaleString()}</p>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">Pending Release</p>
              </div>
              <p className="text-xl font-bold text-foreground">P {data.pendingRelease.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Last Disbursement</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">P {data.lastDisbursement.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{formatDate(data.lastDisbursement.date)}</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="default" className="w-full">
          View Details
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
