"use client"

import * as React from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  CheckCircle, 
  Wallet, 
  DollarSign, 
  AlertTriangle, 
  FileText, 
  Eye,
  ExternalLink,
  Clock,
  TrendingUp
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ProviderDashboard() {
  const { toast } = useToast()
  const [providerStatus, setProviderStatus] = React.useState<any>(null)
  const [paymentsData, setPaymentsData] = React.useState<any>(null)
  const [disputesData, setDisputesData] = React.useState<any>(null)
  const [tendersData, setTendersData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch all dashboard data in parallel
      const [statusRes, tendersRes, disputesRes, escrowRes] = await Promise.all([
        fetch("/api/provider/status?providerId=PROV-123"),
        fetch("/api/tenders?stage=published|clarification|submission&aggregate=provider"),
        fetch("/api/disputes?providerId=PROV-123"),
        fetch("/api/escrow/logs?providerId=PROV-123&summary=true")
      ])

      const [statusData, tendersData, disputesData, escrowData] = await Promise.all([
        statusRes.json(),
        tendersRes.json(),
        disputesRes.json(),
        escrowRes.json()
      ])

      setProviderStatus(statusData.status)
      setTendersData(tendersData.providerMetrics)
      setDisputesData(disputesData.dashboard || disputesData)
      setPaymentsData(escrowData.summary)

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
        <Header title="Provider Portal" />
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
      <Header title="Provider Portal" />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Provider Dashboard</h1>
          <p className="text-slate-600">Welcome back, {providerStatus?.profile?.companyName || 'Service Provider'}</p>
        </div>

        {/* Compact 4-Panel Dashboard Grid */}
        <div className="space-y-6">
          {/* Top Row: KYB Status, Payments & Escrow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Panel 1: KYB Status */}
            <Link href="/provider/kyb">
              <Card className="border-slate-200 bg-white hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    KYB Status
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{providerStatus?.profile?.companyName}</p>
                    <p className="text-xs text-slate-600">{providerStatus?.profile?.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {providerStatus?.kyb?.status === 'verified' && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {providerStatus.kyb.verificationBadge?.level} Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Registration No.</p>
                    <p className="font-medium text-slate-900 text-xs">{providerStatus?.profile?.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Compliance Score</p>
                    <p className="font-medium text-emerald-700">{providerStatus?.kyb?.complianceScore}%</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={(e) => { e.stopPropagation(); window.location.href = '/provider/kyb/update' }}>
                    Update KYB
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            </Link>

            {/* Panel 2: Payments & Escrow */}
            <Link href="/provider/wallet">
              <Card className="border-slate-200 bg-white hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                  Payments & Escrow
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">Read-only totals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-600">Balance</p>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatCurrency(paymentsData?.balance || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Committed</p>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatCurrency(paymentsData?.committed || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Pending</p>
                    <p className="font-semibold text-amber-700 text-sm">
                      {formatCurrency(paymentsData?.pending || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Wallet className="h-3 w-3 mr-1" />
                    View Wallet
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={(e) => { e.stopPropagation(); window.location.href = '/provider/dashboard/active' }}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Escrow Log
                  </Button>
                </div>
              </CardContent>
            </Card>
            </Link>
          </div>

          {/* Bottom Row: Disputes, Tenders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Panel 3: My Disputes */}
            <Link href="/provider/dashboard/disputes">
              <Card className="border-slate-200 bg-white hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <AlertTriangle className="h-5 w-5 text-indigo-600" />
                  My Disputes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {disputesData?.totalCount || 0}
                  </div>
                  <p className="text-xs text-slate-600">Total Disputes</p>
                </div>

                {disputesData?.latestStatus && (
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs text-slate-600 mb-1">Latest Status</p>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                      {disputesData.latestStatus.status}
                    </Badge>
                  </div>
                )}

                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View All Disputes
                </Button>
              </CardContent>
            </Card>
            </Link>

            {/* Panel 4: Tenders */}
            <Link href="/provider/tenders">
              <Card className="border-slate-200 bg-white hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Tenders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">{tendersData?.openCount || 0}</div>
                    <p className="text-xs text-blue-600">Open</p>
                  </div>
                  <div className="text-center p-2 bg-amber-50 rounded-lg">
                    <div className="text-xl font-bold text-amber-700">{tendersData?.closingSoonCount || 0}</div>
                    <p className="text-xs text-amber-600">Closing Soon</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">📄 Requirements</p>
                  <p className="text-xs text-slate-700 font-medium">
                    Two PDFs required. Financial sealed until technical lock.
                  </p>
                </div>

                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Open Tenders
                </Button>
              </CardContent>
            </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
