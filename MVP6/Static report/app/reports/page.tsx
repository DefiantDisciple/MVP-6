"use client"

import { FileText, Shield, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Report {
  period: string
  published: string
  hash: string
}

async function getReports(): Promise<Report[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/reports`, {
    cache: "no-store",
  })
  if (!res.ok) return []
  return res.json()
}

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Procurement Activity Reports</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Official summaries published by the Public Procurement Regulatory Authority (PPRA). All reports are
            cryptographically verified and immutable.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Published Reports</h2>
          <p className="text-sm text-gray-600">Browse and verify quarterly procurement activity reports</p>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reports available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.period} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-blue-900">{report.period}</CardTitle>
                      <CardDescription>
                        Published on{" "}
                        {new Date(report.published).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Hash Display */}
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <p className="text-xs text-gray-600 mb-1">Report Hash</p>
                      <code className="text-xs font-mono text-gray-900 break-all">{report.hash}</code>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                        <Link href={`/reports/${encodeURIComponent(report.period)}`}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href={`/reports/${encodeURIComponent(report.period)}`} target="_blank">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="text-green-700 border-green-200 hover:bg-green-50 bg-transparent"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/audit/reports?hash=${encodeURIComponent(report.hash)}`)
                            const data = await res.json()
                            if (data.verified) {
                              alert("✅ Verified – Report is authentic and untampered")
                            } else {
                              alert("⚠️ Hash not found or invalid")
                            }
                          } catch {
                            alert("⚠️ Verification failed")
                          }
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Verify Authenticity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">About These Reports</h3>
          <p className="text-sm text-blue-800 mb-3">
            Each report is generated by the PPRA and contains comprehensive procurement statistics for the specified
            period. Reports are immutable once published and cryptographically signed to ensure data integrity.
          </p>
          <p className="text-xs text-blue-700">© Public Procurement Regulatory Authority, Botswana</p>
        </div>
      </main>
    </div>
  )
}
