"use client"

import React from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function ProviderKYBPage() {
  const [kybData, setKybData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchKYBData()
  }, [])

  const fetchKYBData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/provider/status?providerId=PROV-123")
      const data = await response.json()
      setKybData(data.status)
    } catch (error) {
      console.error("Failed to fetch KYB data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Provider Portal" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/provider/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Know Your Business (KYB)</h1>
          <p className="text-slate-600">Business verification and compliance status</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-slate-600">Loading KYB information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verification Status */}
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Shield className="h-5 w-5 text-green-600" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {kybData?.kyb?.status || "Verified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Verification Level</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    {kybData?.kyb?.verificationBadge?.level || "Gold"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Compliance Score</span>
                  <span className="font-bold text-green-600">{kybData?.kyb?.complianceScore || 96}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Last Audit</span>
                  <span className="text-slate-900">{formatDate(kybData?.kyb?.lastAuditDate || new Date())}</span>
                </div>
              </CardContent>
            </Card>

            {/* Company Profile */}
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Company Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600">Company Name</label>
                  <p className="font-medium text-slate-900">{kybData?.profile?.companyName || "BuildCorp Services Ltd"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Registration Number</label>
                  <p className="font-medium text-slate-900">{kybData?.profile?.registrationNumber || "BW00001234567"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Category</label>
                  <p className="font-medium text-slate-900">{kybData?.profile?.category || "Construction & Engineering"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Contact Email</label>
                  <p className="font-medium text-slate-900">{kybData?.profile?.contactEmail || "info@buildcorp.bw"}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Contact Phone</label>
                  <p className="font-medium text-slate-900">{kybData?.profile?.contactPhone || "+267 71234567"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="lg:col-span-2 border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{kybData?.metrics?.tendersWon || 15}</div>
                    <p className="text-sm text-slate-600">Tenders Won</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">P {((kybData?.metrics?.totalContractValue || 120000000) / 1000000).toFixed(1)}M</div>
                    <p className="text-sm text-slate-600">Total Contract Value</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{kybData?.metrics?.onTimeCompletionRate || 92}%</div>
                    <p className="text-sm text-slate-600">On-Time Completion</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{kybData?.metrics?.averageRating || 4.8}/5</div>
                    <p className="text-sm text-slate-600">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
