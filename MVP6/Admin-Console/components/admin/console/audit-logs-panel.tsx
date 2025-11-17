"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, AlertCircle, User, Gavel, FileCheck } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { AuditLog } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AuditLogsPanel() {
  const [tenderFilter, setTenderFilter] = useState("")
  const [caseFilter, setCaseFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState("All")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Build query params
  const queryParams = new URLSearchParams()
  if (tenderFilter) queryParams.append("tender", tenderFilter)
  if (caseFilter) queryParams.append("case", caseFilter)
  if (userFilter) queryParams.append("user", userFilter)
  if (dateFrom) queryParams.append("from", dateFrom)
  if (dateTo) queryParams.append("to", dateTo)
  if (eventTypeFilter !== "All") queryParams.append("eventType", eventTypeFilter)

  const { data: logs, error, isLoading } = useSWR<AuditLog[]>(`/api/audit/logs?${queryParams.toString()}`, fetcher)

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log)
    setDrawerOpen(true)
  }

  const getRefIcon = (refType: AuditLog["refType"]) => {
    switch (refType) {
      case "Tender":
        return <FileText className="h-4 w-4" />
      case "Case":
        return <Gavel className="h-4 w-4" />
      case "User":
        return <User className="h-4 w-4" />
      default:
        return <FileCheck className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter audit logs by tender, case, user, date, or event type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tender">Tender ID</Label>
              <Input
                id="tender"
                placeholder="TND-2024-001"
                value={tenderFilter}
                onChange={(e) => setTenderFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="case">Case ID</Label>
              <Input
                id="case"
                placeholder="DSP-2024-001"
                value={caseFilter}
                onChange={(e) => setCaseFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Input
                id="user"
                placeholder="Search user..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger id="eventType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Events</SelectItem>
                  <SelectItem value="Tender">Tender Events</SelectItem>
                  <SelectItem value="Dispute">Dispute Events</SelectItem>
                  <SelectItem value="User">User Events</SelectItem>
                  <SelectItem value="Escrow">Escrow Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTenderFilter("")
                setCaseFilter("")
                setUserFilter("")
                setDateFrom("")
                setDateTo("")
                setEventTypeFilter("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Stream */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Stream</CardTitle>
          <CardDescription>{isLoading ? "Loading..." : `${logs?.length || 0} log entry(ies)`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load audit logs</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}

          {logs && logs.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{formatDate(log.timestamp)}</TableCell>
                      <TableCell className="font-medium">{log.actor}</TableCell>
                      <TableCell>{log.event}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRefIcon(log.refType)}
                          <span className="text-sm">
                            {log.refType}: {log.ref}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">{log.hash.substring(0, 12)}...</code>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleViewLog(log)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {logs && logs.length === 0 && !isLoading && (
            <div className="py-8 text-center text-muted-foreground">No audit logs found matching the filters</div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selectedLog && (
            <>
              <SheetHeader>
                <SheetTitle>Audit Log Details</SheetTitle>
                <SheetDescription>{formatDate(selectedLog.timestamp)}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Log ID:</span>
                      <span className="font-mono">{selectedLog.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span>{formatDate(selectedLog.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actor:</span>
                      <span>{selectedLog.actor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Event:</span>
                      <span>{selectedLog.event}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reference:</span>
                      <span className="flex items-center gap-2">
                        {getRefIcon(selectedLog.refType)}
                        {selectedLog.refType}: {selectedLog.ref}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hash:</span>
                      <code className="break-all text-xs">{selectedLog.hash}</code>
                    </div>
                  </CardContent>
                </Card>

                {selectedLog.payload && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Event Payload</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                        {JSON.stringify(selectedLog.payload, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
