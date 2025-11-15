"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ExternalLink, AlertCircle } from "lucide-react"
import { formatDate, getBusinessDaysRemaining } from "@/lib/date-utils"
import type { Tender, TenderTimeline, TenderStage } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TendersPanel() {
  const { toast } = useToast()
  const [stageFilter, setStageFilter] = useState<TenderStage | "All">("All")
  const [entityFilter, setEntityFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Fetch tenders with filters
  const queryParams = new URLSearchParams()
  if (stageFilter !== "All") queryParams.append("stage", stageFilter)
  if (entityFilter) queryParams.append("entity", entityFilter)
  if (dateFrom) queryParams.append("from", dateFrom)
  if (dateTo) queryParams.append("to", dateTo)

  const { data: tenders, error, isLoading } = useSWR<Tender[]>(`/api/tenders?${queryParams.toString()}`, fetcher)

  // Fetch timeline for selected tender
  const { data: timeline } = useSWR<TenderTimeline>(
    selectedTender ? `/api/tenders/timeline?tenderId=${selectedTender.id}` : null,
    fetcher,
  )

  // Fetch compliance flags for selected tender
  const { data: flags } = useSWR<{ anomalies: string[] }>(
    selectedTender ? `/api/compliance/flags?tenderId=${selectedTender.id}` : null,
    fetcher,
  )

  const handleViewTender = (tender: Tender) => {
    setSelectedTender(tender)
    setDrawerOpen(true)
  }

  const handleOpenEntityView = (tender: Tender) => {
    // Deep-link to entity view
    window.open(`/entity/tenders?tab=${tender.stage.toLowerCase()}&id=${tender.id}`, "_blank")
    toast({
      title: "Opening Entity View",
      description: `Viewing ${tender.title} in entity portal`,
    })
  }

  const getStageColor = (stage: TenderStage) => {
    switch (stage) {
      case "Open":
        return "bg-blue-500"
      case "Evaluation":
        return "bg-yellow-500"
      case "Notice":
        return "bg-orange-500"
      case "Awarded":
        return "bg-green-500"
      case "Active":
        return "bg-teal-500"
      case "Closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (tender: Tender) => {
    if (tender.stage === "Notice" && tender.standstillDate) {
      const remaining = getBusinessDaysRemaining(new Date(tender.standstillDate))
      return `Standstill: ${remaining} business days`
    }
    return tender.status
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter tenders by stage, entity, and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select value={stageFilter} onValueChange={(val) => setStageFilter(val as any)}>
                <SelectTrigger id="stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Stages</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Evaluation">Evaluation</SelectItem>
                  <SelectItem value="Notice">Notice</SelectItem>
                  <SelectItem value="Awarded">Awarded</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity">Procuring Entity</Label>
              <Input
                id="entity"
                placeholder="Search entity..."
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
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
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setStageFilter("All")
                setEntityFilter("")
                setDateFrom("")
                setDateTo("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tenders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenders</CardTitle>
          <CardDescription>{isLoading ? "Loading..." : `Showing ${tenders?.length || 0} tender(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load tenders</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}

          {tenders && tenders.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tender</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Closes/Standstill</TableHead>
                    <TableHead className="text-center">Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenders.map((tender) => (
                    <TableRow key={tender.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="text-balance">{tender.title}</div>
                          {tender.anomalies && tender.anomalies.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {tender.anomalies.map((anomaly, i) => (
                                <Badge key={i} variant="destructive" className="text-xs">
                                  {anomaly}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{tender.entity}</TableCell>
                      <TableCell>
                        <Badge className={getStageColor(tender.stage)}>{tender.stage}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(tender.postedDate)}</TableCell>
                      <TableCell>
                        {tender.closesDate && formatDate(tender.closesDate)}
                        {tender.standstillDate && formatDate(tender.standstillDate)}
                      </TableCell>
                      <TableCell className="text-center">{tender.submissions}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{getStatusText(tender)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewTender(tender)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleOpenEntityView(tender)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {tenders && tenders.length === 0 && !isLoading && (
            <div className="py-8 text-center text-muted-foreground">No tenders found matching the filters</div>
          )}
        </CardContent>
      </Card>

      {/* Tender Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selectedTender && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTender.title}</SheetTitle>
                <SheetDescription>
                  {selectedTender.entity} • {selectedTender.stage}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tender ID:</span>
                      <span className="font-mono">{selectedTender.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted:</span>
                      <span>{formatDate(selectedTender.postedDate)}</span>
                    </div>
                    {selectedTender.closesDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Closes:</span>
                        <span>{formatDate(selectedTender.closesDate)}</span>
                      </div>
                    )}
                    {selectedTender.standstillDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standstill End:</span>
                        <span>{formatDate(selectedTender.standstillDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submissions:</span>
                      <span>{selectedTender.submissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusText(selectedTender)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Flags */}
                {flags && flags.anomalies.length > 0 && (
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-base text-destructive">Compliance Anomalies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {flags.anomalies.map((anomaly, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
                            <span>{anomaly}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {timeline ? (
                      <div className="space-y-4">
                        {timeline.events.map((event, i) => (
                          <div key={event.id} className="flex gap-4">
                            <div className="relative">
                              <div className="h-3 w-3 rounded-full bg-primary" />
                              {i < timeline.events.length - 1 && (
                                <div className="absolute left-1.5 top-3 h-full w-px bg-border" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="text-sm font-medium">{event.event}</div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {formatDate(event.timestamp)} • {event.actor}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="h-12 animate-pulse rounded bg-muted" />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
