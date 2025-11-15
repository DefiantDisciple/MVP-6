"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, User, ExternalLink, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { formatDate } from "@/lib/format"

interface ProfileData {
  entityName: string
  entityType: string
  entityCode: string
  officer: {
    name: string
    email: string
  }
  isVerified: boolean
  procurementThreshold: number
  lastUpdated: string
}

export function OrganizationProfile() {
  const [data, setData] = useState<ProfileData | null>(null)

  useEffect(() => {
    // Simulated API call to /api/entity/profile
    const fetchData = async () => {
      // Mock data - replace with actual fetch
      const mockData: ProfileData = {
        entityName: "Botswana Construction Ltd",
        entityType: "Private Corporation",
        entityCode: "BCL-2024-00456",
        officer: {
          name: "Thabo Mogotsi",
          email: "thabo.mogotsi@bcl.co.bw",
        },
        isVerified: true,
        procurementThreshold: 5000000,
        lastUpdated: "2025-01-08T14:30:00Z",
      }
      setData(mockData)
    }
    fetchData()
  }, [])

  if (!data) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Organization Profile</CardTitle>
            <p className="text-sm text-muted-foreground">Entity information and details</p>
          </div>
        </div>
        {data.isVerified && <Badge className="bg-accent text-accent-foreground">Verified</Badge>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Entity Name</p>
            <p className="text-base font-semibold text-foreground">{data.entityName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Entity Type</p>
            <p className="text-base font-semibold text-foreground">{data.entityType}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Entity Code</p>
            <p className="text-base font-mono text-foreground">{data.entityCode}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Procurement Threshold</p>
            <p className="text-base font-semibold text-foreground">P {data.procurementThreshold.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Authorized Officer</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{data.officer.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-foreground">{data.officer.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">Last updated: {formatDate(data.lastUpdated)}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="default" className="flex-1">
            <Edit className="mr-2 h-4 w-4" />
            Update Organization Info
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            View Full Profile
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
