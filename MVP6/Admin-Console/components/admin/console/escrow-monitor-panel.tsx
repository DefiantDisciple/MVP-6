"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Lock, Unlock, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/date-utils"
import type { EscrowSummary, EscrowEvent } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EscrowMonitorPanel() {
  const {
    data: summary,
    error: summaryError,
    isLoading: summaryLoading,
  } = useSWR<EscrowSummary>("/api/escrow/summary", fetcher)

  const {
    data: events,
    error: eventsError,
    isLoading: eventsLoading,
  } = useSWR<EscrowEvent[]>("/api/escrow/events", fetcher)

  const getEventColor = (event: string) => {
    if (event.includes("Auto-released")) return "bg-green-500"
    if (event.includes("Pending")) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getEventIcon = (event: string) => {
    if (event.includes("Auto-released")) return <Unlock className="h-4 w-4" />
    if (event.includes("Pending")) return <Clock className="h-4 w-4" />
    return <Lock className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Committed
            </CardDescription>
            {summaryLoading ? (
              <div className="h-9 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <CardTitle className="text-3xl">{summary ? formatCurrency(summary.committed) : "P 0.00"}</CardTitle>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Unlock className="h-4 w-4" />
              Released
            </CardDescription>
            {summaryLoading ? (
              <div className="h-9 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <CardTitle className="text-3xl">{summary ? formatCurrency(summary.released) : "P 0.00"}</CardTitle>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Release
            </CardDescription>
            {summaryLoading ? (
              <div className="h-9 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <CardTitle className="text-3xl">{summary ? formatCurrency(summary.pendingRelease) : "P 0.00"}</CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
            <div className="text-sm">
              <p className="font-medium">Read-only Monitor</p>
              <p className="mt-1 text-muted-foreground">
                Escrow releases are fully automated based on verified milestones and required signatures. No manual
                intervention is possible from this console.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Escrow Events</CardTitle>
          <CardDescription>{eventsLoading ? "Loading..." : `${events?.length || 0} event(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          {eventsError && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load escrow events</span>
            </div>
          )}

          {eventsLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}

          {events && events.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Milestone</TableHead>
                    <TableHead className="text-center">Signatures</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="text-sm">{formatDate(event.timestamp)}</TableCell>
                      <TableCell className="font-medium">{event.project}</TableCell>
                      <TableCell>{event.milestone}</TableCell>
                      <TableCell className="text-center">
                        <span className="flex items-center justify-center gap-1">
                          {event.signaturesComplete === event.signaturesRequired ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                          {event.signaturesComplete}/{event.signaturesRequired}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEventColor(event.event)}>
                          <span className="mr-1">{getEventIcon(event.event)}</span>
                          {event.event}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">{event.hash.substring(0, 16)}...</code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {events && events.length === 0 && !eventsLoading && (
            <div className="py-8 text-center text-muted-foreground">No escrow events found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
