import { OrganizationProfile } from "@/components/organization-profile"
import { KycKybStatus } from "@/components/kyc-kyb-status"
import { ProcurementPerformance } from "@/components/procurement-performance"
import { FinancialSummary } from "@/components/financial-summary"
import { QuickActions } from "@/components/quick-actions"
import Link from "next/link"
import { FileText, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EntityDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <Link href="/landing" className="text-xl font-semibold hover:text-primary transition-colors">
              TenderHub
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-block">Entity User</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Entity Dashboard</h1>
              <p className="text-muted-foreground">Manage your organization and procurement activities</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top Row - Three equal panels */}
            <OrganizationProfile />
            <KycKybStatus />
            <ProcurementPerformance />

            {/* Bottom Row - Financial Summary spans 2 columns, Quick Actions spans 1 */}
            <div className="lg:col-span-2">
              <FinancialSummary />
            </div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
