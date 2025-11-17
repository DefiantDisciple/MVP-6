"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Shield, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Eye,
  ExternalLink
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function EntityDashboard() {
  const { toast } = useToast()
  const [entityProfile, setEntityProfile] = React.useState<any>(null)
  const [entityStatus, setEntityStatus] = React.useState<any>(null)
  const [performanceData, setPerformanceData] = React.useState<any>(null)
  const [financialSummary, setFinancialSummary] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch all dashboard data in parallel
      const [profileRes, statusRes, performanceRes, financialRes] = await Promise.all([
        fetch("/api/entity/profile?entityId=entity-1"),
        fetch("/api/entity/status?entityId=entity-1"),
        fetch("/api/tenders?entityId=entity-1&aggregate=entity"),
        fetch("/api/escrow/logs?entityId=entity-1&summary=true")
      ])

      const [profileData, statusData, performanceData, financialData] = await Promise.all([
        profileRes.json(),
        statusRes.json(),
        performanceRes.json(),
        financialRes.json()
      ])

      setEntityProfile(profileData.profile)
      setEntityStatus(statusData.status)
      setPerformanceData(performanceData.performance)
      setFinancialSummary(financialData.summary)

    } catch (error) {
      console.error("[v0] Fetch dashboard error:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Entity Portal" />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Entity Portal" />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Procurement Dashboard</h1>
          <p className="text-slate-600">Welcome back, {entityProfile?.officer?.name || 'Procurement Officer'}</p>
        </div>

        {/* 5-Panel Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel 1: Organization Profile */}
          <Card className="lg:col-span-6 border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Organization Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">{entityProfile?.name}</p>
                  <p className="text-xs text-slate-600">{entityProfile?.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  {entityProfile?.verification?.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      <Shield className="h-3 w-3 mr-1" />
                      {entityProfile.verification.badgeLevel} Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Entity Code</p>
                  <p className="font-medium text-slate-900">{entityProfile?.code}</p>
                </div>
                <div>
                  <p className="text-slate-600">Procurement Threshold</p>
                  <p className="font-medium text-slate-900">{formatCurrency(entityProfile?.procurementThreshold || 0)}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-900">{entityProfile?.officer?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="h-3 w-3" />
                  <span>{entityProfile?.officer?.email}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Last updated: {entityProfile?.lastUpdated ? formatDate(entityProfile.lastUpdated) : 'N/A'}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href="/entity/profile/update">
                  <Button size="sm" variant="outline" className="text-xs">
                    Update Organization Info
                  </Button>
                </Link>
                <Link href="/entity/profile">
                  <Button size="sm" variant="ghost" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Panel 2: KYC & KYB Status */}
          <Card className="lg:col-span-6 border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Shield className="h-5 w-5 text-indigo-600" />
                KYC & KYB Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* KYC Sub-card */}
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">KYC Status</h4>
                  <Badge className={`${entityStatus?.kyc?.status === 'verified' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {entityStatus?.kyc?.statusText || 'Pending'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Updated: {entityStatus?.kyc?.updatedDate ? formatDate(entityStatus.kyc.updatedDate) : 'N/A'}
                </p>
                <div className="flex gap-2">
                  <Link href="/entity/kyc/update">
                    <Button size="sm" variant="outline" className="text-xs">Update KYC</Button>
                  </Link>
                  <Link href="/entity/kyc">
                    <Button size="sm" variant="ghost" className="text-xs">View</Button>
                  </Link>
                </div>
              </div>

              {/* KYB Sub-card */}
              <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900">KYB Status</h4>
                  <Badge className={`${entityStatus?.kyb?.status === 'verified' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {entityStatus?.kyb?.statusText || 'Pending'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Updated: {entityStatus?.kyb?.updatedDate ? formatDate(entityStatus.kyb.updatedDate) : 'N/A'}
                </p>
                <div className="flex gap-2">
                  <Link href="/entity/kyb/update">
                    <Button size="sm" variant="outline" className="text-xs">Update KYB</Button>
                  </Link>
                  <Link href="/entity/kyb">
                    <Button size="sm" variant="ghost" className="text-xs">View</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel 3: Procurement Performance Snapshot */}
          <Card className="lg:col-span-4 border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Performance Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{performanceData?.published || 0}</div>
                  <p className="text-xs text-blue-600">Published</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-700">{performanceData?.underEvaluation || 0}</div>
                  <p className="text-xs text-amber-600">Under Evaluation</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700">{performanceData?.active || 0}</div>
                  <p className="text-xs text-emerald-600">Active</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-700">{performanceData?.completed || 0}</div>
                  <p className="text-xs text-slate-600">Completed</p>
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Avg Cycle Days</span>
                  <span className="font-medium text-slate-900">{performanceData?.avgCycleDays || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Compliance %</span>
                  <span className="font-medium text-emerald-700">{performanceData?.compliancePercentage || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel 4: Financial Summary */}
          <Card className="lg:col-span-4 border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                Financial Summary
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">Corporate Escrow Account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Committed (Escrow)</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(financialSummary?.committed || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Released</span>
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(financialSummary?.released || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pending Release</span>
                  <span className="font-semibold text-amber-700">
                    {formatCurrency(financialSummary?.pendingRelease || 0)}
                  </span>
                </div>
              </div>

              {financialSummary?.lastDisbursement && (
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-600 mb-1">Last Disbursement</p>
                  <p className="font-medium text-slate-900">
                    {formatCurrency(financialSummary.lastDisbursement.amount)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(financialSummary.lastDisbursement.date)}
                  </p>
                </div>
              )}

              <Link href="/entity/dashboard/active">
                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Panel 5: Quick Actions */}
          <Card className="lg:col-span-4 border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Award className="h-5 w-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/entity/tenders" className="block">
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900">Tenders</p>
                        <p className="text-xs text-slate-600">Manage open tenders</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/entity/disputes" className="block">
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-slate-900">Disputes</p>
                        <p className="text-xs text-slate-600">Review active disputes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/entity/reports" className="block">
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-medium text-slate-900">Reports</p>
                        <p className="text-xs text-slate-600">Performance analytics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/entity/notifications" className="block">
                <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-slate-900">Notifications</p>
                        <p className="text-xs text-slate-600">Recent updates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
