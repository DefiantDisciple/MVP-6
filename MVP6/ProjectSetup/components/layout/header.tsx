"use client"
import { useRouter } from "next/navigation"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, User, FileText } from "lucide-react"
import { useStore } from "@/lib/store"
import { getInitials } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title?: string
}

export function Header({ title = "TenderHub" }: HeaderProps) {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const [notifications, setNotifications] = useState<any[]>([])
  const [icpStatus, setIcpStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')

  useEffect(() => {
    fetchNotifications()
    checkIcpConnection()
    // Check ICP connection every 30 seconds
    const interval = setInterval(checkIcpConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?userId=PROV-123&limit=10")
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const checkIcpConnection = async () => {
    try {
      // Attempt to check ICP connection - replace with actual ICP connection check
      // For now, simulate a connection check
      setIcpStatus('connecting')

      // Simulate connection check delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // In production, this should check actual ICP canister connection
      // Example: await window.ic?.plug?.isConnected() or similar
      const isConnected = true // Replace with actual check

      setIcpStatus(isConnected ? 'connected' : 'disconnected')
    } catch (error) {
      console.error("Failed to check ICP connection:", error)
      setIcpStatus('disconnected')
    }
  }

  const unreadNotifications = useMemo(() =>
    notifications.filter((n) => !n.isRead),
    [notifications]
  )

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-gray-900" />
          <Link href="/landing" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            VerDEX Systems
          </Link>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* ICP Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
            <div className="relative">
              <div className={`h-2.5 w-2.5 rounded-full ${icpStatus === 'connected' ? 'bg-green-500' :
                icpStatus === 'connecting' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              {icpStatus === 'connected' && (
                <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
              )}
            </div>
            <span className="text-xs font-medium text-gray-700">
              ICP {icpStatus === 'connected' ? 'Connected' : icpStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100 w-10 h-10 flex-shrink-0">
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {unreadNotifications.length > 0 ? (
                unreadNotifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-3">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.message}</div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 h-10 flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user?.name || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg min-w-[200px]">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
