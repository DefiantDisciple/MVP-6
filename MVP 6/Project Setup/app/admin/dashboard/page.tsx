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
  Clock
} from "lucide-react"

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
    totalTenders: tenders.length,
    activeTenders: tenders.filter(t => ['published', 'clarification', 'submission', 'evaluation'].includes(t.stage)).length,
    totalBids: bids.length,
    pendingDisputes: disputes.filter(d => d.status === 'pending').length,
    totalEscrowBalance: escrowEvents.reduce((sum, event) => sum + (event.balance || 0), 0)
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
      <div className="min-h-screen bg-gray-50">
        <Header title="Admin Console" />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading admin dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Console" />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Console</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h1>
                <p className="text-gray-600">Monitor platform activity and key metrics</p>
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
                          <div className={`p-2 rounded-full ${
                            event.type === 'deposit' ? 'bg-green-100 text-green-600' :
                            event.type === 'release' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{event.description}</p>
                            <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(event.amount)}</p>
                          <p className="text-sm text-gray-500">{event.type}</p>
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
                <p className="text-gray-600">Monitor and manage all tender processes</p>
              </div>

              <div className="space-y-4">
                {tenders.map((tender) => (
                  <Card key={tender.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">{tender.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{tender.description}</CardDescription>
                        </div>
                        <StatusPill status={tender.stage} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Budget</p>
                          <p className="font-semibold">{formatCurrency(tender.budget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Category</p>
                          <p className="font-semibold text-sm">{tender.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Created</p>
                          <p className="font-semibold text-sm">{formatDate(tender.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Submissions</p>
                          <p className="font-semibold text-sm">
                            {bids.filter(b => b.tenderId === tender.id).length}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "disputes" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dispute Management</h1>
                <p className="text-gray-600">Review and resolve tender disputes</p>
              </div>

              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <Card key={dispute.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">
                            Dispute #{dispute.id.substring(0, 8)} - {dispute.reason}
                          </CardTitle>
                          <CardDescription>{dispute.details}</CardDescription>
                        </div>
                        <Badge variant={
                          dispute.status === 'pending' ? 'destructive' : 
                          dispute.status === 'under_review' ? 'default' :
                          dispute.status === 'resolved' ? 'secondary' : 'outline'
                        }>
                          {dispute.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Provider</p>
                          <p className="font-semibold">{dispute.providerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Filed Date</p>
                          <p className="font-semibold text-sm">{formatDate(dispute.filedAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tender</p>
                          <p className="font-semibold text-sm">
                            {tenders.find(t => t.id === dispute.tenderId)?.title || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      
                      {dispute.resolution && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm font-medium text-green-800 mb-1">Resolution:</p>
                          <p className="text-sm text-green-700">{dispute.resolution}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {dispute.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Review Evidence
                            </Button>
                            <Button size="sm" variant="default">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {dispute.status === 'under_review' && (
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4 mr-2" />
                            Under Review
                          </Button>
                        )}
                        {dispute.status === 'resolved' && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolved
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "escrow" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Escrow Monitor</h1>
                <p className="text-gray-600">Track escrow transactions and balances</p>
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
                          <div className={`p-2 rounded-full ${
                            event.type === 'deposit' ? 'bg-green-100 text-green-600' :
                            event.type === 'release' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{event.description}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(event.timestamp)} • {event.performedByRole}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            event.type === 'deposit' ? 'text-green-600' :
                            event.type === 'release' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {event.type === 'release' ? '-' : '+'}{formatCurrency(event.amount)}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">{event.type}</p>
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
                <p className="text-gray-600">Manage platform users and their roles</p>
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
                <p className="text-gray-600">System activity and security audit trail</p>
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
                          <div className={`p-2 rounded-full ${
                            event.source === 'core-canister' ? 'bg-blue-100 text-blue-600' :
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
