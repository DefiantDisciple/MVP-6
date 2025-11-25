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
  ExternalLink,
  Settings,
  Activity
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
  const [activeTab, setActiveTab] = React.useState("overview")

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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tenders", label: "Tenders", icon: FileText },
    { id: "disputes", label: "Disputes", icon: AlertTriangle },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "reports", label: "Reports", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header title="Entity Portal" />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-700">Loading entity dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header title="Entity Portal" />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 shadow-sm border-r border-blue-800 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Entity Portal</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon

                if (item.href) {
                  return (
                    <Link key={item.id} href={item.href}>
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-blue-200 hover:bg-blue-800 hover:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    </Link>
                  )
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === item.id
                      ? "bg-blue-800 text-white border border-blue-700"
                      : "text-blue-200 hover:bg-blue-800 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-blue-50">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Entity Overview</h1>
                <p className="text-gray-700">Welcome back, {entityProfile?.officer?.name || 'Procurement Officer'}</p>
              </div>

              {/* Organization Profile */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold">Organization Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-base font-semibold text-gray-900">{entityProfile?.name}</p>
                      <p className="text-sm text-gray-600">{entityProfile?.type}</p>
                    </div>
                    <div className="flex items-start justify-end">
                      {entityProfile?.verification?.isVerified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          {entityProfile.verification.badgeLevel} Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Entity Code</p>
                      <p className="text-base font-semibold text-gray-900">{entityProfile?.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Procurement Threshold</p>
                      <p className="text-base font-semibold text-blue-600">{formatCurrency(entityProfile?.procurementThreshold || 0)}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-base font-semibold text-gray-900">{entityProfile?.officer?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span>{entityProfile?.officer?.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Snapshot */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Performance Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{performanceData?.published || 8}</div>
                        <p className="text-xs text-blue-600">Published</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-700">{performanceData?.underEvaluation || 5}</div>
                        <p className="text-xs text-amber-600">Under Evaluation</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-700">{performanceData?.active || 3}</div>
                        <p className="text-xs text-emerald-600">Active</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-700">{performanceData?.completed || 12}</div>
                        <p className="text-xs text-slate-600">Completed</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Cycle Days</span>
                        <span className="font-medium text-gray-900">{performanceData?.avgCycleDays || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compliance %</span>
                        <span className="font-medium text-emerald-700">{performanceData?.compliancePercentage || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      Financial Summary
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600">Corporate Escrow Account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Committed (Escrow)</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(financialSummary?.committed || 1570000)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Released</span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(financialSummary?.released || 8200000)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending Release</span>
                        <span className="font-semibold text-amber-700">
                          {formatCurrency(financialSummary?.pendingRelease || 320000)}
                        </span>
                      </div>
                    </div>

                    {financialSummary?.lastDisbursement && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs text-gray-600 mb-1">Last Disbursement</p>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(financialSummary.lastDisbursement.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(financialSummary.lastDisbursement.date)}
                        </p>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setActiveTab("budget")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "tenders" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Tenders</h1>
                <p className="text-gray-700">Manage and monitor all tender activities</p>
              </div>

              {/* Tender Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">8</div>
                    <p className="text-sm text-gray-600">Published</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-2">5</div>
                    <p className="text-sm text-gray-600">Under Evaluation</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">3</div>
                    <p className="text-sm text-gray-600">Active</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-gray-600 mb-2">12</div>
                    <p className="text-sm text-gray-600">Completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Tenders */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Recent Tenders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Road Construction - Phase 1</h3>
                          <p className="text-sm text-gray-600">TENDER-001</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <p className="font-medium text-gray-900">P 450,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Published:</span>
                          <p className="font-medium text-gray-900">2024-11-10</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bids Received:</span>
                          <p className="font-medium text-gray-900">12</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <p className="font-medium text-red-600">2024-12-10</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Building Renovation Project</h3>
                          <p className="text-sm text-gray-600">TENDER-002</p>
                        </div>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Under Review
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <p className="font-medium text-gray-900">P 320,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Published:</span>
                          <p className="font-medium text-gray-900">2024-11-15</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bids Received:</span>
                          <p className="font-medium text-gray-900">8</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <p className="font-medium text-amber-600">2024-12-05</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Infrastructure Development</h3>
                          <p className="text-sm text-gray-600">TENDER-003</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <FileText className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <p className="font-medium text-gray-900">P 800,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Published:</span>
                          <p className="font-medium text-gray-900">2024-11-20</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bids Received:</span>
                          <p className="font-medium text-gray-900">15</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <p className="font-medium text-gray-900">2024-12-20</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "disputes" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Disputes</h1>
                <p className="text-gray-700">Track and manage dispute cases</p>
              </div>

              {/* Dispute Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">4</div>
                    <p className="text-sm text-gray-600">Total Disputes</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-2">2</div>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">1</div>
                    <p className="text-sm text-gray-600">Resolved</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">1</div>
                    <p className="text-sm text-gray-600">Escalated</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Disputes */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    Recent Disputes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Contract Scope Disagreement</h3>
                          <p className="text-sm text-gray-600">DISPUTE-001 • TENDER-001</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3 mr-1" />
                          In Progress
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Provider disputes the agreed scope of work for road construction phase 1</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Filed:</span>
                          <p className="font-medium text-gray-900">2024-11-18</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-medium text-gray-900">P 50,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <p className="font-medium text-gray-900">2024-11-22</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Payment Delay Issue</h3>
                          <p className="text-sm text-gray-600">DISPUTE-002 • TENDER-002</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Payment release was delayed due to documentation verification</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Filed:</span>
                          <p className="font-medium text-gray-900">2024-11-10</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-medium text-gray-900">P 120,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Resolved:</span>
                          <p className="font-medium text-green-600">2024-11-20</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Budget & Financial Management</h1>
                <p className="text-gray-700">Monitor budget allocation and financial transactions</p>
              </div>

              {/* Budget Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 text-sm">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      Total Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">P 15.0M</div>
                      <p className="text-xs text-gray-600">Annual Allocation</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 text-sm">
                      <Clock className="h-4 w-4 text-gray-600" />
                      Committed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700 mb-1">P 1.57M</div>
                      <p className="text-xs text-gray-600">In Escrow</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Released
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">P 8.20M</div>
                      <p className="text-xs text-gray-600">Disbursed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 text-sm">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700 mb-1">P 5.23M</div>
                      <p className="text-xs text-gray-600">Remaining</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Breakdown */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Budget Breakdown by Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Active Contracts (3)</span>
                        <span className="text-sm font-semibold text-gray-900">P 1,570,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '10.5%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Completed & Released (12)</span>
                        <span className="text-sm font-semibold text-gray-900">P 8,200,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '54.7%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Pending Release</span>
                        <span className="text-sm font-semibold text-gray-900">P 320,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: '2.1%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Available Budget</span>
                        <span className="text-sm font-semibold text-blue-700">P 5,230,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '34.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Recent Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Payment Release</p>
                          <p className="text-xs text-gray-600">TENDER-001 • 2024-11-20</p>
                        </div>
                        <span className="font-semibold text-green-600">-P 450,000</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Escrow Deposit</p>
                          <p className="text-xs text-gray-600">TENDER-002 • 2024-11-18</p>
                        </div>
                        <span className="font-semibold text-gray-700">P 320,000</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Payment Release</p>
                          <p className="text-xs text-gray-600">TENDER-003 • 2024-11-15</p>
                        </div>
                        <span className="font-semibold text-green-600">-P 800,000</span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Escrow Deposit</p>
                          <p className="text-xs text-gray-600">TENDER-004 • 2024-11-12</p>
                        </div>
                        <span className="font-semibold text-gray-700">P 500,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Utilization */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Budget Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-700 mb-1">65.1%</div>
                        <p className="text-sm text-gray-600">Total Utilization Rate</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Q1 Spending</span>
                          <span className="font-medium text-gray-900">P 2.5M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Q2 Spending</span>
                          <span className="font-medium text-gray-900">P 3.1M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Q3 Spending</span>
                          <span className="font-medium text-gray-900">P 2.8M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Q4 Spending (YTD)</span>
                          <span className="font-medium text-blue-700">P 1.4M</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-gray-700">Total Spent</span>
                          <span className="font-bold text-gray-900">P 9.8M</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
                <p className="text-gray-700">View and generate procurement reports</p>
              </div>

              {/* Report Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Tender Reports</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Overview of all tender activities and statistics</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Financial Reports</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Detailed financial transactions and escrow status</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Performance Reports</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Compliance metrics and cycle time analysis</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reports */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Q4 Tender Summary Report</p>
                          <p className="text-sm text-gray-600">Generated on 2024-11-20</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">October Financial Statement</p>
                          <p className="text-sm text-gray-600">Generated on 2024-11-01</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-900">Compliance Performance Report</p>
                          <p className="text-sm text-gray-600">Generated on 2024-10-25</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-700">Configure your portal settings</p>
              </div>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Settings interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
