import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Bell, CheckCheck, AlertCircle, Info, CheckCircle2 } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "KYB Verification Update",
    message: "Your KYB documents are currently under review. We'll notify you once the verification is complete.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Payment Received",
    message: "You've received a payment of $1,250.00 for Invoice #1234.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Monthly Service Fee",
    message: "Your monthly subscription fee of $350.00 has been processed.",
    time: "1 day ago",
    read: false,
  },
  {
    id: 4,
    type: "success",
    title: "KYC Verification Approved",
    message: "Your identity has been successfully verified. You now have full access to all provider features.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Welcome to Provider Dashboard",
    message: "Thank you for joining our platform. Complete your KYC and KYB verifications to unlock all features.",
    time: "5 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-600" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getBackground = (type: string, read: boolean) => {
    if (read) return ""
    switch (type) {
      case "success":
        return "border-l-4 border-l-green-600 bg-green-50 dark:bg-green-950/10"
      case "alert":
        return "border-l-4 border-l-amber-600 bg-amber-50 dark:bg-amber-950/10"
      case "info":
      default:
        return "border-l-4 border-l-blue-600 bg-blue-50 dark:bg-blue-950/10"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6 hover:bg-primary/10">
          <Link href="/provider">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && <Badge className="bg-primary text-primary-foreground">{unreadCount} Unread</Badge>}
          </div>
          <p className="text-muted-foreground">Stay updated with important alerts and messages</p>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
            <Button variant="outline" size="sm" className="border-border bg-transparent">
              <Bell className="mr-2 h-4 w-4" />
              Notification Settings
            </Button>
          </div>

          {/* Notifications List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">All Notifications</CardTitle>
              <CardDescription>View all your recent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border border-border rounded-lg hover:shadow-md transition-all ${getBackground(notification.type, notification.read)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-base text-foreground">{notification.title}</h3>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-border bg-transparent">
                Load More Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
