"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, FileCheck, Eye, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/format"

interface StatusData {
  kyc: {
    status: "approved" | "pending" | "rejected"
    updatedAt: string
  }
  kyb: {
    status: "approved" | "pending" | "rejected"
    updatedAt: string
  }
}

const statusConfig = {
  approved: { label: "Approved", variant: "default" as const, color: "bg-accent text-accent-foreground" },
  pending: { label: "Pending Review", variant: "secondary" as const, color: "bg-secondary text-secondary-foreground" },
  rejected: { label: "Rejected", variant: "destructive" as const, color: "bg-destructive text-destructive-foreground" },
}

export function KycKybStatus() {
  const [data, setData] = useState<StatusData | null>(null)

  useEffect(() => {
    // Simulated API call to /api/entity/status
    const fetchData = async () => {
      const mockData: StatusData = {
        kyc: {
          status: "approved",
          updatedAt: "2024-12-15T09:20:00Z",
        },
        kyb: {
          status: "approved",
          updatedAt: "2024-12-20T11:45:00Z",
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
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">KYC & KYB Status</CardTitle>
            <p className="text-sm text-muted-foreground">Compliance verification status</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* KYC Card */}
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">KYC</h3>
              </div>
              <Badge className={statusConfig[data.kyc.status].color}>{statusConfig[data.kyc.status].label}</Badge>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Updated: {formatDate(data.kyc.updatedAt)}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="mr-1 h-3 w-3" />
                Update
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
            </div>
          </div>

          {/* KYB Card */}
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">KYB</h3>
              </div>
              <Badge className={statusConfig[data.kyb.status].color}>{statusConfig[data.kyb.status].label}</Badge>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Updated: {formatDate(data.kyb.updatedAt)}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="mr-1 h-3 w-3" />
                Update
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
