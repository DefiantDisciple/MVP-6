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
  TrendingUp,
  BarChart3,
  Bell,
  User,
  Settings,
  Activity,
  CreditCard,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { OpenTendersPanel } from "@/components/provider/tenders/open-tenders-panel"
import { ClarificationsPanel } from "@/components/provider/tenders/clarifications-panel"
import { MySubmissionsPanel } from "@/components/provider/tenders/my-submissions-panel"
import { NoticeToAwardPanel } from "@/components/provider/tenders/notice-to-award-panel"
import { AwardedPanel } from "@/components/provider/tenders/awarded-panel"
import { ActivePanel } from "@/components/provider/tenders/active-panel"
import { ClosedPanel } from "@/components/provider/tenders/closed-panel"
import { MyDisputesPanel } from "@/components/provider/tenders/my-disputes-panel"

export default function ProviderDashboard() {
  const { toast } = useToast()
  const [providerStatus, setProviderStatus] = React.useState<any>(null)
  const [paymentsData, setPaymentsData] = React.useState<any>(null)
  const [disputesData, setDisputesData] = React.useState<any>(null)
  const [tendersData, setTendersData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState("overview")
  const [currentTenderTab, setCurrentTenderTab] = React.useState<string>("open")

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

  const tenderTabs = [
    { id: "open", label: "Open Tenders" },
    { id: "clarifications", label: "Clarifications" },
    { id: "submissions", label: "My Submissions" },
    { id: "notice", label: "Notice to Award" },
    { id: "awarded", label: "Awarded" },
    { id: "active", label: "Active" },
    { id: "closed", label: "Closed" },
    { id: "disputes", label: "My Disputes" },
  ]

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tenders", label: "Tenders", icon: FileText },
    { id: "bids", label: "My Bids", icon: FileText },
    { id: "disputes", label: "Disputes", icon: AlertTriangle },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "kyb", label: "KYB Status", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleTenderTabChange = (tabId: string) => {
    setCurrentTenderTab(tabId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header title="Provider Portal" />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-700">Loading provider dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header title="Provider Portal" />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 shadow-sm border-r border-blue-800 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Provider Portal</h2>
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Overview</h1>
                <p className="text-gray-700">Welcome back, {providerStatus?.profile?.companyName || 'Service Provider'}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* KYB Status */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Shield className="h-5 w-5 text-blue-600" />
                      KYB Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{providerStatus?.profile?.companyName}</p>
                        <p className="text-xs text-gray-600">{providerStatus?.profile?.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {providerStatus?.kyb?.status === 'verified' && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {providerStatus.kyb.verificationBadge?.level} Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Registration No.</p>
                        <p className="font-medium text-gray-900 text-xs">{providerStatus?.profile?.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Compliance Score</p>
                        <p className="font-medium text-emerald-700">{providerStatus?.kyb?.complianceScore}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href="/provider/kyb/update">
                        <Button size="sm" variant="outline" className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50">
                          Update KYB
                        </Button>
                      </Link>
                      <Link href="/provider/kyb">
                        <Button size="sm" variant="ghost" className="text-xs text-gray-700 hover:bg-gray-100">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Payments & Escrow */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      Payments & Escrow
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600">Read-only totals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-600">Balance</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {formatCurrency(paymentsData?.balance || 125000)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Committed</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {formatCurrency(paymentsData?.committed || 450000)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Pending</p>
                        <p className="font-semibold text-amber-700 text-sm">
                          {formatCurrency(paymentsData?.pending || 75000)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => setActiveTab("wallet")}
                      >
                        <Wallet className="h-3 w-3 mr-1" />
                        View Wallet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Disputes */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      My Disputes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {disputesData?.totalCount || 0}
                      </div>
                      <p className="text-xs text-gray-600">Total Disputes</p>
                    </div>

                    {disputesData?.latestStatus && (
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-600 mb-1">Latest Status</p>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                          {disputesData.latestStatus.status}
                        </Badge>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs"
                      onClick={() => setActiveTab("disputes")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View All Disputes
                    </Button>
                  </CardContent>
                </Card>

                {/* Tenders */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="h-5 w-5 text-blue-600" />
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

                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">📄 Requirements</p>
                      <p className="text-xs text-gray-700 font-medium">
                        Two PDFs required. Financial sealed until technical lock.
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                      onClick={() => setActiveTab("tenders")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Open Tenders
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other tabs content */}
          {activeTab === "tenders" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Tenders</h1>
                <p className="text-gray-700">Browse and manage all tender opportunities</p>
              </div>

              {/* Tab Navigation */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div
                  role="tablist"
                  aria-label="Tender management tabs"
                  className="flex gap-1 border-b border-gray-200 overflow-x-auto p-1"
                >
                  {tenderTabs.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={currentTenderTab === tab.id}
                      onClick={() => handleTenderTabChange(tab.id)}
                      className={`
                        px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-md
                        ${currentTenderTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Panels */}
                <div className="p-6">
                  {currentTenderTab === "open" && (
                    <div role="tabpanel">
                      <OpenTendersPanel />
                    </div>
                  )}
                  {currentTenderTab === "clarifications" && (
                    <div role="tabpanel">
                      <ClarificationsPanel />
                    </div>
                  )}
                  {currentTenderTab === "submissions" && (
                    <div role="tabpanel">
                      <MySubmissionsPanel />
                    </div>
                  )}
                  {currentTenderTab === "notice" && (
                    <div role="tabpanel">
                      <NoticeToAwardPanel />
                    </div>
                  )}
                  {currentTenderTab === "awarded" && (
                    <div role="tabpanel">
                      <AwardedPanel />
                    </div>
                  )}
                  {currentTenderTab === "active" && (
                    <div role="tabpanel">
                      <ActivePanel />
                    </div>
                  )}
                  {currentTenderTab === "closed" && (
                    <div role="tabpanel">
                      <ClosedPanel />
                    </div>
                  )}
                  {currentTenderTab === "disputes" && (
                    <div role="tabpanel">
                      <MyDisputesPanel />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bids" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bids</h1>
                <p className="text-gray-700">Track your submitted bids</p>
              </div>

              {/* Bid Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
                    <p className="text-sm text-gray-600">Total Bids</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">3</div>
                    <p className="text-sm text-gray-600">Won</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-2">5</div>
                    <p className="text-sm text-gray-600">Pending</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-gray-600 mb-2">4</div>
                    <p className="text-sm text-gray-600">Lost</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bids */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Recent Bids
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
                          Awarded
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Bid Amount:</span>
                          <p className="font-medium text-gray-900">P 450,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted:</span>
                          <p className="font-medium text-gray-900">2024-11-10</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium text-green-600">Contract Signed</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Score:</span>
                          <p className="font-medium text-gray-900">92/100</p>
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
                          <span className="text-gray-600">Bid Amount:</span>
                          <p className="font-medium text-gray-900">P 320,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted:</span>
                          <p className="font-medium text-gray-900">2024-11-15</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium text-amber-600">Evaluation</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Score:</span>
                          <p className="font-medium text-gray-900">Pending</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Infrastructure Development</h3>
                          <p className="text-sm text-gray-600">TENDER-003</p>
                        </div>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          Not Selected
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Bid Amount:</span>
                          <p className="font-medium text-gray-900">P 200,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted:</span>
                          <p className="font-medium text-gray-900">2024-11-05</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className="font-medium text-red-600">Not Awarded</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Score:</span>
                          <p className="font-medium text-gray-900">78/100</p>
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
                <p className="text-gray-700">Manage and track all dispute cases</p>
              </div>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <MyDisputesPanel />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Wallet & Payments</h1>
                <p className="text-gray-700">Manage your payment methods and transaction history</p>
              </div>

              {/* Wallet Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Current Balance */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      Current Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-gray-900 mb-2">P 2,450,000</div>
                      <p className="text-gray-600">Available Funds</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Committed */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Total Committed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-green-700 mb-2">P 850,000</div>
                      <p className="text-gray-600">Contract Value</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Release */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Clock className="h-5 w-5 text-amber-600" />
                      Pending Release
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-3xl font-bold text-amber-700 mb-2">P 320,000</div>
                      <p className="text-gray-600">Held in Escrow</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <History className="h-5 w-5 text-blue-600" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Payment received for Road Construction</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>2024-11-15</span>
                            <Badge variant="outline" className="text-xs">TENDER-001</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+P 450,000</p>
                        <Badge variant="secondary" className="text-xs">RELEASE</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <div>
                          <p className="font-medium text-gray-900">Escrow hold for Building Renovation</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>2024-11-10</span>
                            <Badge variant="outline" className="text-xs">TENDER-002</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">P 320,000</p>
                        <Badge variant="outline" className="text-xs">HOLD</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Initial deposit for Infrastructure Project</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>2024-11-05</span>
                            <Badge variant="outline" className="text-xs">TENDER-003</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">+P 200,000</p>
                        <Badge variant="default" className="text-xs">DEPOSIT</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "kyb" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Know Your Business (KYB)</h1>
                <p className="text-gray-700">Business verification and compliance status</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Verification Status */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Shield className="h-5 w-5 text-green-600" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Verification Level</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Gold
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Compliance Score</span>
                      <span className="font-bold text-green-600">96%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Audit</span>
                      <span className="text-gray-900">2024-10-15</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Profile */}
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Company Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Company Name</label>
                      <p className="font-medium text-gray-900">BuildCorp Services Ltd</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Registration Number</label>
                      <p className="font-medium text-gray-900">BW00001234567</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Category</label>
                      <p className="font-medium text-gray-900">Construction & Engineering</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Contact Email</label>
                      <p className="font-medium text-gray-900">info@buildcorp.bw</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Contact Phone</label>
                      <p className="font-medium text-gray-900">+267 71234567</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="lg:col-span-2 border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">15</div>
                        <p className="text-sm text-gray-600">Tenders Won</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">P 120.0M</div>
                        <p className="text-sm text-gray-600">Total Contract Value</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">92%</div>
                        <p className="text-sm text-gray-600">On-Time Completion</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
