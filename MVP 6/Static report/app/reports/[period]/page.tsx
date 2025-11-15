"use client"

import { Shield, FileText, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

interface ReportData {
  period: string
  published: string
  hash: string
  summary: {
    entities: number
    providers: number
    tenders: number
    value: number
    avgCycle: number
    disputes: {
      filed: number
      resolved: number
    }
    compliance: number
    escrowReleases: number
  }
  stages: Array<{ stage: string; count: number; notes?: string }>
  topEntities: Array<{ entity: string; tenders: number; value: number; cycle: number }>
  escrow: {
    committed: number
    released: number
    pending: number
    avgVerifyDays: number
  }
  disputes: Array<{
    id: string
    tender: string
    filedBy?: string
    decision: string
    days: number
  }>
  audit: Array<{
    type: string
    count: number
    hash: string
    timestamp: string
  }>
}

async function getReport(period: string): Promise<ReportData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/reports/${encodeURIComponent(period)}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function formatCurrency(value: number): string {
  return `P ${value.toLocaleString()}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ period: string }>
}) {
  const { period } = await params
  const report = await getReport(period)

  if (!report) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg print:bg-blue-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Procurement Activity Report</h1>
              <p className="text-blue-100 text-lg">{report.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-blue-100">
            <span>Issued by: Public Procurement Regulatory Authority (PPRA)</span>
            <span>•</span>
            <span>Published: {formatDate(report.published)}</span>
          </div>
        </div>
      </header>

      {/* Report Hash & Verification */}
      <div className="bg-blue-50 border-b border-blue-100 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-blue-700 mb-1 font-medium">Report Hash</p>
              <code className="text-sm font-mono text-blue-900 break-all">{report.hash}</code>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-700 border-green-300 hover:bg-green-50 bg-transparent"
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
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Summary Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Procuring Entities Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">{report.summary.entities}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Service Providers Registered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">{report.summary.providers.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Tenders Published</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">{report.summary.tenders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Contract Value Awarded</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(report.summary.value)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average Cycle Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">{report.summary.avgCycle} days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Disputes Filed / Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">
                  {report.summary.disputes.filed} / {report.summary.disputes.resolved}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700">{report.summary.compliance}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Escrow Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-900">{report.summary.escrowReleases}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Breakdown by Stage */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Breakdown by Stage</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Stage</TableHead>
                    <TableHead className="font-semibold text-right">Count</TableHead>
                    <TableHead className="font-semibold">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.stages.map((stage) => (
                    <TableRow key={stage.stage}>
                      <TableCell className="font-medium">{stage.stage}</TableCell>
                      <TableCell className="text-right">{stage.count}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{stage.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Top Procuring Entities */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Top Procuring Entities by Value</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Entity</TableHead>
                    <TableHead className="font-semibold text-right">Tenders Awarded</TableHead>
                    <TableHead className="font-semibold text-right">Value (P)</TableHead>
                    <TableHead className="font-semibold text-right">Avg Cycle Time (days)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.topEntities.map((entity, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{entity.entity}</TableCell>
                      <TableCell className="text-right">{entity.tenders}</TableCell>
                      <TableCell className="text-right">{entity.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{entity.cycle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Escrow Summary */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Escrow Summary</h2>
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Total Committed</TableCell>
                    <TableCell className="text-right">{formatCurrency(report.escrow.committed)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Released</TableCell>
                    <TableCell className="text-right text-green-700">
                      {formatCurrency(report.escrow.released)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Pending Release</TableCell>
                    <TableCell className="text-right text-orange-600">
                      {formatCurrency(report.escrow.pending)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Avg Verification Time</TableCell>
                    <TableCell className="text-right">{report.escrow.avgVerifyDays} days</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Disputes & Resolutions */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Disputes & Resolutions</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Case ID</TableHead>
                    <TableHead className="font-semibold">Tender</TableHead>
                    <TableHead className="font-semibold">Filed By</TableHead>
                    <TableHead className="font-semibold">Decision</TableHead>
                    <TableHead className="font-semibold text-right">Resolution Time (days)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                      <TableCell>{dispute.tender}</TableCell>
                      <TableCell>{dispute.filedBy || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={dispute.decision === "Approved" ? "default" : "secondary"}>
                          {dispute.decision}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{dispute.days}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* System Audit Integrity */}
        <section>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">System Audit Integrity</h2>
          <Card className="bg-gray-50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Event Type</TableHead>
                    <TableHead className="font-semibold text-right">Count</TableHead>
                    <TableHead className="font-semibold">Sample Hash</TableHead>
                    <TableHead className="font-semibold">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.audit.map((audit, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{audit.type}</TableCell>
                      <TableCell className="text-right">{audit.count}</TableCell>
                      <TableCell className="font-mono text-xs">{audit.hash}</TableCell>
                      <TableCell className="text-sm">{formatDate(audit.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            All events are cryptographically signed and immutable
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-semibold">
              Report Hash: <code className="font-mono">{report.hash}</code>
            </p>
            <p>© Public Procurement Regulatory Authority, Botswana</p>
            <p className="text-xs text-gray-600">Generated by ProcureHub on {formatDate(report.published)}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
