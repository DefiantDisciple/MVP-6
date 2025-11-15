"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Mock user role - in production this would come from session/auth
const getUserRole = () => "admin" // Change to 'user' to test redirect

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  )
}

function SystemOverview() {
  const { data: stats, isLoading: statsLoading } = useSWR("/api/tenders/stats", fetcher)
  const { data: expiring, isLoading: expiringLoading } = useSWR("/api/notice/expiring", fetcher)

  if (statsLoading || expiringLoading) return <SkeletonCard />

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">System Overview</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Open:</span>
          <span className="font-medium text-gray-900">{stats?.open || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Evaluation:</span>
          <span className="font-medium text-gray-900">{stats?.evaluation || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Notice to Award:</span>
          <span className="font-medium text-gray-900">{stats?.noticeToAward || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Awarded:</span>
          <span className="font-medium text-gray-900">{stats?.awarded || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active:</span>
          <span className="font-medium text-gray-900">{stats?.active || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Closed:</span>
          <span className="font-medium text-gray-900">{stats?.closed || 0}</span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-orange-600 font-medium">Standstill Ending ≤ 3 days:</span>
            <span className="font-bold text-orange-600">{expiring?.count || 0}</span>
          </div>
        </div>
      </div>
      <Link
        href="/admin/console?tab=tenders"
        className="mt-4 block w-full text-center bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 transition-colors"
      >
        Open Console
      </Link>
    </div>
  )
}

function DisputeCentre() {
  const { data: stats, isLoading } = useSWR("/api/disputes/stats", fetcher)

  if (isLoading) return <SkeletonCard />

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Dispute Centre</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Active Disputes:</span>
          <span className="font-medium text-gray-900">{stats?.activeDisputes || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Awaiting Decision:</span>
          <span className="font-medium text-gray-900">{stats?.awaitingDecision || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Avg Resolution Time:</span>
          <span className="font-medium text-gray-900">{stats?.avgResolutionDays || 0} days</span>
        </div>
      </div>
      <Link
        href="/admin/console?tab=disputes"
        className="mt-4 block w-full text-center bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 transition-colors"
      >
        Go to Disputes
      </Link>
    </div>
  )
}

function EscrowOversight() {
  const { data: summary, isLoading } = useSWR("/api/escrow/summary", fetcher)

  if (isLoading) return <SkeletonCard />

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Escrow Oversight</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Committed:</span>
          <span className="font-medium text-gray-900">P {(summary?.committed || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Released:</span>
          <span className="font-medium text-gray-900">P {(summary?.released || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pending Release:</span>
          <span className="font-medium text-gray-900">P {(summary?.pendingRelease || 0).toLocaleString()}</span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Last Auto-Release:</span>
            <span className="font-medium text-gray-900">
              {summary?.lastAutoRelease ? formatDate(summary.lastAutoRelease) : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <Link
        href="/admin/console?tab=escrow"
        className="mt-4 block w-full text-center bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 transition-colors"
      >
        Escrow Monitor
      </Link>
    </div>
  )
}

function ComplianceAnomalies() {
  const { data: summary, isLoading } = useSWR("/api/compliance/summary", fetcher)

  if (isLoading) return <SkeletonCard />

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Compliance & Anomalies</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Late Evaluations:</span>
          <span className="font-medium text-gray-900">{summary?.lateEvaluations || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Award Before Standstill (blocked):</span>
          <span className="font-medium text-gray-900">{summary?.blockedAwards || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Bid Spread Outliers:</span>
          <span className="font-medium text-gray-900">{summary?.bidOutliers || 0}</span>
        </div>
      </div>
      <Link
        href="/admin/console?tab=tenders"
        className="mt-4 block w-full text-center bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 transition-colors"
      >
        View Details
      </Link>
    </div>
  )
}

function RecentAuditEvents() {
  const { data: events, isLoading } = useSWR("/api/audit/recent", fetcher)

  if (isLoading) return <SkeletonCard />

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Recent Audit Events</h3>
      <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
        {events?.events?.map((event: any, idx: number) => (
          <div key={idx} className="py-2 border-b border-gray-100 last:border-0">
            <div className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</div>
            <div className="text-gray-900">
              <span className="font-medium">{event.actor}</span> · {event.event}
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/admin/console?tab=audit"
        className="mt-4 block w-full text-center bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 transition-colors"
      >
        Open Audit Log
      </Link>
    </div>
  )
}

function UsersRoles() {
  const { data: summary, isLoading: summaryLoading } = useSWR("/api/users/summary", fetcher)
  const { data: pending, isLoading: pendingLoading } = useSWR("/api/users/pending", fetcher)

  if (summaryLoading || pendingLoading) return <SkeletonCard />

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Users & Roles</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Users:</span>
          <span className="font-medium text-gray-900">{summary?.totalUsers || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Entities:</span>
          <span className="font-medium text-gray-900">{summary?.entities || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Providers:</span>
          <span className="font-medium text-gray-900">{summary?.providers || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Admins:</span>
          <span className="font-medium text-gray-900">{summary?.admins || 0}</span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Role Change Requests:</span>
            <span className="font-medium text-gray-900">{pending?.roleChangeRequests || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Suspended:</span>
            <span className="font-medium text-gray-900">{pending?.suspended || 0}</span>
          </div>
        </div>
      </div>
      <Link
        href="/admin/console?tab=users"
        className="mt-4 block w-full text-center bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 transition-colors"
      >
        Manage Users
      </Link>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const userRole = getUserRole()
    if (userRole !== "admin") {
      router.push("/signin")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a8a] text-white py-6 px-8 shadow-md">
        <h1 className="text-3xl font-bold">Regulator Dashboard</h1>
        <p className="text-blue-200 mt-1">Oversight snapshot</p>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <SystemOverview />
          <DisputeCentre />
          <EscrowOversight />
          <ComplianceAnomalies />
          <RecentAuditEvents />
          <UsersRoles />
        </div>
      </main>
    </div>
  )
}
