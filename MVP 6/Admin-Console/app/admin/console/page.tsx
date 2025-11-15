"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TendersPanel from "@/components/admin/console/tenders-panel"
import DisputesPanel from "@/components/admin/console/disputes-panel"
import EscrowMonitorPanel from "@/components/admin/console/escrow-monitor-panel"
import AuditLogsPanel from "@/components/admin/console/audit-logs-panel"
import UsersRolesPanel from "@/components/admin/console/users-roles-panel"

const TABS = ["tenders", "disputes", "escrow", "audit", "users"] as const
type TabValue = (typeof TABS)[number]

export default function AdminConsolePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentTab, setCurrentTab] = useState<TabValue>("tenders")
  // Removed isAuthorized state

  // Auth guard: check if user has admin role
  // Removed auth guard

  // Deep-link support: read tab from URL query param
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabValue | null
    if (tabParam && TABS.includes(tabParam)) {
      setCurrentTab(tabParam)
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as TabValue
    setCurrentTab(newTab)

    // Update URL using History API without navigation
    const url = new URL(window.location.href)
    url.searchParams.set("tab", newTab)
    window.history.pushState({}, "", url.toString())
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = TABS.indexOf(currentTab)

    if (e.key === "ArrowLeft" && currentIndex > 0) {
      handleTabChange(TABS[currentIndex - 1])
    } else if (e.key === "ArrowRight" && currentIndex < TABS.length - 1) {
      handleTabChange(TABS[currentIndex + 1])
    }
  }

  // Show nothing while checking auth

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Admin Console</h1>
          <p className="text-sm text-muted-foreground">System oversight and management</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList
              className="h-12 w-full justify-start rounded-none border-0 bg-transparent p-0"
              onKeyDown={handleKeyDown}
            >
              <TabsTrigger
                value="tenders"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Tenders
              </TabsTrigger>
              <TabsTrigger
                value="disputes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Disputes
              </TabsTrigger>
              <TabsTrigger
                value="escrow"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Escrow Monitor
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Audit Logs
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Users & Roles
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Panel Content */}
      <main className="container mx-auto flex-1 px-6 py-6">
        {currentTab === "tenders" && <TendersPanel />}
        {currentTab === "disputes" && <DisputesPanel />}
        {currentTab === "escrow" && <EscrowMonitorPanel />}
        {currentTab === "audit" && <AuditLogsPanel />}
        {currentTab === "users" && <UsersRolesPanel />}
      </main>
    </div>
  )
}
