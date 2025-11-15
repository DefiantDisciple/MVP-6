"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Scale, BarChart3, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Tenders",
    description: "Browse and manage open tenders",
    icon: FileText,
    href: "/entity/dashboard/open",
    color: "text-primary",
  },
  {
    title: "Disputes",
    description: "View and resolve disputes",
    icon: Scale,
    href: "/entity/disputes",
    color: "text-accent",
  },
  {
    title: "Reports",
    description: "Generate and view reports",
    icon: BarChart3,
    href: "/entity/reports",
    color: "text-primary",
  },
  {
    title: "Notifications",
    description: "Check recent updates",
    icon: Bell,
    href: "/entity/notifications",
    color: "text-accent",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Common tasks and navigation</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button variant="outline" className="h-auto w-full justify-start p-4 hover:bg-muted bg-transparent">
                <div className="flex w-full items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
