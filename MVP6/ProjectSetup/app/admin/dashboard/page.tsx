"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/ui/status-pill"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  BarChart3,
  FileText,
  Users,
  AlertTriangle,
  Shield,
  DollarSign,
  Activity,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  Mail
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [tenders, setTenders] = useState<any[]>([])
  const [disputes, setDisputes] = useState<any[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [escrowEvents, setEscrowEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([
    {
      id: "entity-1",
      email: "procurement@ministry.gov",
      name: "Ministry of Infrastructure",
      role: "entity",
      organizationName: "Ministry of Infrastructure",
      phone: "+1-555-0101",
      address: "123 Government Ave, Capital City",
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "entity-2",
      email: "admin@health.gov",
      name: "Department of Health",
      role: "entity",
      organizationName: "Department of Health",
      phone: "+1-555-0102",
      address: "456 Health Plaza, Capital City",
      createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "provider-1",
      email: "contact@techflow.com",
      name: "TechFlow Solutions",
      role: "provider",
      organizationName: "TechFlow Solutions Inc.",
      phone: "+1-555-0201",
      address: "789 Tech Park, Innovation District",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "provider-2",
      email: "bids@eliteconstruction.com",
      name: "Elite Construction Co.",
      role: "provider",
      organizationName: "Elite Construction Co.",
      phone: "+1-555-0202",
      address: "321 Builder's Row, Industrial Zone",
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "provider-3",
      email: "info@globalservices.com",
      name: "Global Services Ltd.",
      role: "provider",
      organizationName: "Global Services Ltd.",
      phone: "+1-555-0203",
      address: "654 Service Center, Business District",
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "provider-4",
      email: "team@innovationpartners.com",
      name: "Innovation Partners",
      role: "provider",
      organizationName: "Innovation Partners LLC",
      phone: "+1-555-0204",
      address: "987 Innovation Blvd, Tech Quarter",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "admin-1",
      email: "admin@tenderhub.gov",
      name: "System Administrator",
      role: "admin",
      organizationName: "TenderHub Platform",
      phone: "+1-555-0301",
      address: "100 Platform Way, Digital City",
      createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ])
  const [auditEvents, setAuditEvents] = useState<any[]>([
    {
      id: "audit-1",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      source: "core-canister",
      kind: "tender_created",
      data: "New tender 'Digital Infrastructure Upgrade' created by Ministry of Infrastructure",
      userId: "entity-1",
      userRole: "entity",
    },
    {
      id: "audit-2",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      source: "core-canister",
      kind: "bid_submitted",
      data: "Bid submitted for tender 'School Building Construction' by TechFlow Solutions",
      userId: "provider-1",
      userRole: "provider",
    },
    {
      id: "audit-3",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      source: "escrow-adapter",
      kind: "escrow_created",
      data: "Escrow account created for tender 'School Building Construction' - Amount: $27,500,000",
      userId: "system",
      userRole: "system",
    },
    {
      id: "audit-4",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      source: "core-canister",
      kind: "tender_awarded",
      data: "Tender 'School Building Construction' awarded to TechFlow Solutions",
      userId: "entity-1",
      userRole: "entity",
    },
    {
      id: "audit-5",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      source: "core-canister",
      kind: "dispute_filed",
      data: "Dispute filed by Elite Construction Co. for tender evaluation discrepancy",
      userId: "provider-2",
      userRole: "provider",
    },
    {
      id: "audit-6",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      source: "core-canister",
      kind: "clarification_requested",
      data: "Clarification requested for tender 'Digital Infrastructure Upgrade' by Global Services Ltd.",
      userId: "provider-3",
      userRole: "provider",
    },
    {
      id: "audit-7",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      source: "escrow-adapter",
      kind: "payment_released",
      data: "Milestone payment of $2,000,000 released for completed deliverable",
      userId: "admin-1",
      userRole: "admin",
    },
    {
      id: "audit-8",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      source: "core-canister",
      kind: "evaluation_completed",
      data: "Evaluation completed for tender 'School Building Construction' - 4 bids evaluated",
      userId: "entity-1",
      userRole: "entity",
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tendersRes, disputesRes, bidsRes, escrowRes] = await Promise.all([
        fetch("/api/tenders"),
        fetch("/api/disputes"),
        fetch("/api/submissions"),
        fetch("/api/escrow")
      ])
      const tendersData = await tendersRes.json()
      const disputesData = await disputesRes.json()
      const bidsData = await bidsRes.json()
      const escrowData = await escrowRes.json()

      setTenders(tendersData.tenders || [])
      setDisputes(disputesData.disputes || [])
      setBids(bidsData.bids || [])
      setEscrowEvents(escrowData.events || [])

    } catch (error) {
      console.error("Failed to load admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalTenders: tenders.length || 28,
    activeTenders: tenders.filter(t => ['published', 'clarification', 'submission', 'evaluation'].includes(t.stage)).length || 16,
    totalBids: bids.length || 35,
    pendingDisputes: disputes.filter(d => d.status === 'pending').length || 2,
    totalEscrowBalance: escrowEvents.reduce((sum, event) => sum + (event.balance || 0), 0) || 1570000
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tenders", label: "All Tenders", icon: FileText },
    { id: "disputes", label: "Disputes", icon: AlertTriangle, badge: stats.pendingDisputes },
    { id: "escrow", label: "Escrow Monitor", icon: Shield },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "audit", label: "Audit Log", icon: Activity },
    { id: "settings", label: "System Settings", icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header title="Admin Console" />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-700">Loading admin dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header title="Admin Console" />

      {/* Quick Actions Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Platform Administration</h2>
          <Link href="/admin/invites">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Users
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 shadow-sm border-r border-blue-800 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Admin Console</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
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
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h1>
                <p className="text-gray-700">Monitor platform activity and key metrics</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTenders}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeTenders}</div>
                    <p className="text-xs text-muted-foreground">Currently open</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Disputes</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingDisputes}</div>
                    <p className="text-xs text-muted-foreground">Need review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalEscrowBalance)}</div>
                    <p className="text-xs text-muted-foreground">Total held</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrowEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${event.type === 'deposit' ? 'bg-green-100 text-green-600' :
                            event.type === 'release' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{event.description}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(event.amount)}</p>
                          <p className="text-sm text-muted-foreground">{event.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tenders" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">All Tenders</h1>
                <p className="text-gray-700">Monitor and manage all tender processes</p>
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
                          <p className="text-sm text-gray-600">TENDER-001 - Ministry of Infrastructure</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <p className="font-medium text-gray-900">P 450,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Published:</span>
                          <p className="font-medium text-gray-900">2024-11-10</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bids:</span>
                          <p className="font-medium text-gray-900">12</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <p className="font-medium text-red-600">2024-12-10</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <p className="font-medium text-gray-900">Infrastructure</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Building Renovation Project</h3>
                          <p className="text-sm text-gray-600">TENDER-002 - Department of Health</p>
                        </div>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                          Under Evaluation
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <p className="font-medium text-gray-900">P 320,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Published:</span>
                          <p className="font-medium text-gray-900">2024-11-15</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bids:</span>
                          <p className="font-medium text-gray-900">8</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <p className="font-medium text-amber-600">2024-12-05</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <p className="font-medium text-gray-900">Construction</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Infrastructure Development</h3>
                          <p className="text-sm text-gray-600">TENDER-003 - Ministry of Infrastructure</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Published
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Budget:</span>
                          <p className="font-medium text-gray-900">P 800,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Published:</span>
                          <p className="font-medium text-gray-900">2024-11-20</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bids:</span>
                          <p className="font-medium text-gray-900">15</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <p className="font-medium text-gray-900">2024-12-20</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <p className="font-medium text-gray-900">Infrastructure</p>
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dispute Management</h1>
                <p className="text-gray-700">Review and resolve tender disputes</p>
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

              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    All Disputes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Contract Scope Disagreement</h3>
                          <p className="text-sm text-gray-600">DISPUTE-001 - TENDER-001</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          In Progress
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Provider disputes the agreed scope of work for road construction phase 1</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Provider:</span>
                          <p className="font-medium text-gray-900">BuildCorp Services</p>
                        </div>
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
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Evidence
                        </Button>
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Payment Delay Issue</h3>
                          <p className="text-sm text-gray-600">DISPUTE-002 - TENDER-002</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Resolved
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Payment release was delayed due to documentation verification</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Provider:</span>
                          <p className="font-medium text-gray-900">TechFlow Solutions</p>
                        </div>
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
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                        <p className="text-sm font-medium text-green-800 mb-1">Resolution:</p>
                        <p className="text-sm text-green-700">Documentation verified and payment released successfully</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Resolution
                      </Button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Quality Standards Dispute</h3>
                          <p className="text-sm text-gray-600">DISPUTE-003 - TENDER-003</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          In Progress
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Entity claims delivered work does not meet quality standards</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Provider:</span>
                          <p className="font-medium text-gray-900">Global Services Ltd</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Filed:</span>
                          <p className="font-medium text-gray-900">2024-11-15</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-medium text-gray-900">P 80,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <p className="font-medium text-gray-900">2024-11-21</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Evidence
                        </Button>
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Contract Termination Request</h3>
                          <p className="text-sm text-gray-600">DISPUTE-004 - TENDER-001</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Escalated
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">Provider requests contract termination due to force majeure</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Provider:</span>
                          <p className="font-medium text-gray-900">Elite Construction</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Filed:</span>
                          <p className="font-medium text-gray-900">2024-11-12</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-medium text-gray-900">P 450,000</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <p className="font-medium text-gray-900">2024-11-23</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Urgent Review Required
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "escrow" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Escrow Monitor</h1>
                <p className="text-gray-700">Track escrow transactions and balances</p>
              </div>

              {/* Escrow Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(escrowEvents.filter(e => e.type === 'deposit').reduce((sum, e) => sum + e.amount, 0))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Releases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(escrowEvents.filter(e => e.type === 'release').reduce((sum, e) => sum + e.amount, 0))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats.totalEscrowBalance)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Escrow Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrowEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${event.type === 'deposit' ? 'bg-green-100 text-green-600' :
                            event.type === 'release' ? 'bg-blue-100 text-blue-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{event.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)} • {event.performedByRole}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${event.type === 'deposit' ? 'text-green-600' :
                            event.type === 'release' ? 'text-blue-600' :
                              'text-yellow-600'
                            }`}>
                            {event.type === 'release' ? '-' : '+'}{formatCurrency(event.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Users & Roles</h1>
                <p className="text-gray-700">Manage platform users and their roles</p>
              </div>

              {/* User Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Entities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.filter(u => u.role === 'entity').length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Providers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.filter(u => u.role === 'provider').length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                {users.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                      <p className="text-muted-foreground">Loading user data...</p>
                    </CardContent>
                  </Card>
                ) : (
                  users.map((user) => (
                    <Card key={user.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="mb-2">{user.name}</CardTitle>
                            <CardDescription>{user.organizationName}</CardDescription>
                          </div>
                          <Badge variant={
                            user.role === 'admin' ? 'destructive' :
                              user.role === 'entity' ? 'default' : 'secondary'
                          }>
                            {user.role}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Email</p>
                            <p className="font-semibold text-sm">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Phone</p>
                            <p className="font-semibold text-sm">{user.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Joined</p>
                            <p className="font-semibold text-sm">{formatDate(user.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Roles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Log</h1>
                <p className="text-gray-700">System activity and security audit trail</p>
              </div>

              {/* Audit Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditEvents.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Core Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {auditEvents.filter(e => e.source === 'core-canister').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Escrow Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {auditEvents.filter(e => e.source === 'escrow-adapter').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {auditEvents.filter(e => {
                        const eventDate = new Date(e.timestamp)
                        const today = new Date()
                        return eventDate.toDateString() === today.toDateString()
                      }).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Audit Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auditEvents.length === 0 ? (
                      <div className="py-12 text-center">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Audit Events</h3>
                        <p className="text-muted-foreground">Loading audit data...</p>
                      </div>
                    ) : (
                      auditEvents.map((event) => (
                        <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${event.source === 'core-canister' ? 'bg-blue-100 text-blue-600' :
                              event.source === 'escrow-adapter' ? 'bg-green-100 text-green-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                              {event.source === 'core-canister' ? (
                                <FileText className="h-4 w-4" />
                              ) : event.source === 'escrow-adapter' ? (
                                <DollarSign className="h-4 w-4" />
                              ) : (
                                <Activity className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm capitalize">{event.kind.replace('_', ' ')}</p>
                                <Badge variant="outline" className="text-xs">
                                  {event.source}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700">{event.data}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>User: {event.userId}</span>
                                <span>Role: {event.userRole}</span>
                                <span>{formatDate(event.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={
                            event.kind.includes('created') || event.kind.includes('awarded') ? 'default' :
                              event.kind.includes('dispute') || event.kind.includes('rejected') ? 'destructive' :
                                'secondary'
                          } className="text-xs">
                            {event.kind}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
                <p className="text-gray-600">Configure platform settings and preferences</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Platform Status</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Demo Mode:</span>
                            <Badge className="bg-green-500">Active</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Authentication:</span>
                            <Badge variant="secondary">Disabled</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">API Status:</span>
                            <Badge className="bg-green-500">Online</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Data Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mock Tenders:</span>
                            <span className="font-medium">{stats.totalTenders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mock Bids:</span>
                            <span className="font-medium">{stats.totalBids}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mock Disputes:</span>
                            <span className="font-medium">{disputes.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
