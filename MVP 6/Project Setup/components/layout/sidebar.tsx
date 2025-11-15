"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Role } from "@/lib/types"

interface SidebarProps {
  role: Role
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const entityLinks = [
    { href: "/entity/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/entity/tenders", label: "My Tenders", icon: "📋" },
    { href: "/entity/evaluations", label: "Evaluations", icon: "⚖️" },
    { href: "/entity/awards", label: "Awards", icon: "🏆" },
  ]

  const providerLinks = [
    { href: "/provider/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/provider/tenders", label: "Browse Tenders", icon: "🔍" },
    { href: "/provider/submissions", label: "My Submissions", icon: "📤" },
    { href: "/provider/awards", label: "My Awards", icon: "🏆" },
  ]

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/tenders", label: "All Tenders", icon: "📋" },
    { href: "/admin/disputes", label: "Disputes", icon: "⚠️" },
    { href: "/admin/users", label: "Users", icon: "👥" },
  ]

  const links = role === "entity" ? entityLinks : role === "provider" ? providerLinks : adminLinks

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          {role === "entity" ? "Entity Portal" : role === "provider" ? "Provider Portal" : "Admin Portal"}
        </h2>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
