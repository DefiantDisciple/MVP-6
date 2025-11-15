"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronRight } from "lucide-react"
import OpenPanel from "@/components/entity/tenders/open-panel"
import EvaluationPanel from "@/components/entity/tenders/evaluation-panel"
import NoticePanel from "@/components/entity/tenders/notice-panel"
import AwardedPanel from "@/components/entity/tenders/awarded-panel"
import ActivePanel from "@/components/entity/tenders/active-panel"
import ClosedPanel from "@/components/entity/tenders/closed-panel"

type TabKey = "open" | "evaluation" | "notice" | "awarded" | "active" | "closed"

const tabs: { key: TabKey; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "evaluation", label: "Evaluation" },
  { key: "notice", label: "Notice to Award" },
  { key: "awarded", label: "Awarded" },
  { key: "active", label: "Active" },
  { key: "closed", label: "Closed" },
]

export default function TendersPage() {
  const searchParams = useSearchParams()
  const [currentTab, setCurrentTab] = useState<TabKey>("open")
  const [focusedTabIndex, setFocusedTabIndex] = useState(0)

  // Deep-linking: read ?tab= on mount
  useEffect(() => {
    const tabParam = searchParams?.get("tab") as TabKey
    if (tabParam && tabs.some((t) => t.key === tabParam)) {
      setCurrentTab(tabParam)
      const index = tabs.findIndex((t) => t.key === tabParam)
      setFocusedTabIndex(index)
    }
  }, [searchParams])

  const handleTabChange = (tab: TabKey) => {
    setCurrentTab(tab)
    // Update URL without navigation
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?tab=${tab}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      const newIndex = index > 0 ? index - 1 : tabs.length - 1
      setFocusedTabIndex(newIndex)
      document.getElementById(`tab-${tabs[newIndex].key}`)?.focus()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      const newIndex = index < tabs.length - 1 ? index + 1 : 0
      setFocusedTabIndex(newIndex)
      document.getElementById(`tab-${tabs[newIndex].key}`)?.focus()
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleTabChange(tabs[index].key)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="font-medium text-foreground">Procuring Entity</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">Tenders</span>
          </div>

          {/* Tabs Bar */}
          <div role="tablist" aria-label="Tender stages" className="flex gap-1 border-b border-border">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                id={`tab-${tab.key}`}
                role="tab"
                aria-selected={currentTab === tab.key}
                aria-controls={`panel-${tab.key}`}
                tabIndex={currentTab === tab.key ? 0 : -1}
                onClick={() => handleTabChange(tab.key)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  currentTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {currentTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="container mx-auto px-6 py-6">
        {currentTab === "open" && (
          <div id="panel-open" role="tabpanel" aria-labelledby="tab-open">
            <OpenPanel />
          </div>
        )}

        {currentTab === "evaluation" && (
          <div id="panel-evaluation" role="tabpanel" aria-labelledby="tab-evaluation">
            <EvaluationPanel />
          </div>
        )}

        {currentTab === "notice" && (
          <div id="panel-notice" role="tabpanel" aria-labelledby="tab-notice">
            <NoticePanel />
          </div>
        )}

        {currentTab === "awarded" && (
          <div id="panel-awarded" role="tabpanel" aria-labelledby="tab-awarded">
            <AwardedPanel />
          </div>
        )}

        {currentTab === "active" && (
          <div id="panel-active" role="tabpanel" aria-labelledby="tab-active">
            <ActivePanel />
          </div>
        )}

        {currentTab === "closed" && (
          <div id="panel-closed" role="tabpanel" aria-labelledby="tab-closed">
            <ClosedPanel />
          </div>
        )}
      </div>
    </div>
  )
}
