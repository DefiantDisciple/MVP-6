"use client"

import { useSearchParams } from "next/navigation"

export default function AdminConsolePage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "tenders"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1e3a8a] text-white py-6 px-8 shadow-md">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-blue-200 mt-1">Current tab: {tab}</p>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-4">
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Console
          </h2>
          <p className="text-gray-600">
            This is the console view for <span className="font-semibold">{tab}</span> management.
          </p>
        </div>
      </main>
    </div>
  )
}
