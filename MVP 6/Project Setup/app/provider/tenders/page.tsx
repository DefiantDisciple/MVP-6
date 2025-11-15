"use client"

import { useState, useEffect, type KeyboardEvent, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { OpenTendersPanel } from "@/components/provider/tenders/open-tenders-panel"
import { ClarificationsPanel } from "@/components/provider/tenders/clarifications-panel"
import { MySubmissionsPanel } from "@/components/provider/tenders/my-submissions-panel"
import { NoticeToAwardPanel } from "@/components/provider/tenders/notice-to-award-panel"
import { AwardedPanel } from "@/components/provider/tenders/awarded-panel"
import { ActivePanel } from "@/components/provider/tenders/active-panel"
import { ClosedPanel } from "@/components/provider/tenders/closed-panel"
import { MyDisputesPanel } from "@/components/provider/tenders/my-disputes-panel"

type TabId = "open" | "clarifications" | "submissions" | "notice" | "awarded" | "active" | "closed" | "disputes"

const tabs: { id: TabId; label: string }[] = [
  { id: "open", label: "Open Tenders" },
  { id: "clarifications", label: "Clarifications" },
  { id: "submissions", label: "My Submissions" },
  { id: "notice", label: "Notice to Award" },
  { id: "awarded", label: "Awarded" },
  { id: "active", label: "Active" },
  { id: "closed", label: "Closed" },
  { id: "disputes", label: "My Disputes" },
]

function TendersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<TabId>("open")
  const [focusedTabIndex, setFocusedTabIndex] = useState(0)

  // Read tab from URL on mount
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabId
    if (tabParam && tabs.find((t) => t.id === tabParam)) {
      setCurrentTab(tabParam)
      setFocusedTabIndex(tabs.findIndex((t) => t.id === tabParam))
    }
  }, [searchParams])

  const handleTabChange = (tabId: TabId) => {
    setCurrentTab(tabId)
    const newUrl = `/provider/tenders?tab=${tabId}`
    window.history.pushState({}, "", newUrl)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      const newIndex = index > 0 ? index - 1 : tabs.length - 1
      setFocusedTabIndex(newIndex)
      document.getElementById(`tab-${tabs[newIndex].id}`)?.focus()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      const newIndex = index < tabs.length - 1 ? index + 1 : 0
      setFocusedTabIndex(newIndex)
      document.getElementById(`tab-${tabs[newIndex].id}`)?.focus()
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleTabChange(tabs[index].id)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/provider/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Service Provider → Tenders</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6">
        {/* Tab Navigation */}
        <div
          role="tablist"
          aria-label="Tender management tabs"
          className="flex gap-1 border-b border-border overflow-x-auto"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={currentTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={currentTab === tab.id ? 0 : -1}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                ${
                  currentTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="py-6">
          {currentTab === "open" && (
            <div role="tabpanel" id="panel-open" aria-labelledby="tab-open">
              <OpenTendersPanel />
            </div>
          )}
          {currentTab === "clarifications" && (
            <div role="tabpanel" id="panel-clarifications" aria-labelledby="tab-clarifications">
              <ClarificationsPanel />
            </div>
          )}
          {currentTab === "submissions" && (
            <div role="tabpanel" id="panel-submissions" aria-labelledby="tab-submissions">
              <MySubmissionsPanel />
            </div>
          )}
          {currentTab === "notice" && (
            <div role="tabpanel" id="panel-notice" aria-labelledby="tab-notice">
              <NoticeToAwardPanel />
            </div>
          )}
          {currentTab === "awarded" && (
            <div role="tabpanel" id="panel-awarded" aria-labelledby="tab-awarded">
              <AwardedPanel />
            </div>
          )}
          {currentTab === "active" && (
            <div role="tabpanel" id="panel-active" aria-labelledby="tab-active">
              <ActivePanel />
            </div>
          )}
          {currentTab === "closed" && (
            <div role="tabpanel" id="panel-closed" aria-labelledby="tab-closed">
              <ClosedPanel />
            </div>
          )}
          {currentTab === "disputes" && (
            <div role="tabpanel" id="panel-disputes" aria-labelledby="tab-disputes">
              <MyDisputesPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProviderTendersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1600px] px-6 py-6">
            <h1 className="text-2xl font-semibold text-foreground">Service Provider → Tenders</h1>
          </div>
        </div>
        <div className="mx-auto max-w-[1600px] px-6 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <TendersContent />
    </Suspense>
  )
}
