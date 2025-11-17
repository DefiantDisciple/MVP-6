"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UploadTenderModal } from "@/components/upload-tender-modal"
import { Download, Eye, RefreshCcw } from "lucide-react"

export type Tender = {
  id: string
  title: string
  postedDate: Date
  closingDate: Date
  clarificationCutoff: Date
  submissions: number
  status: "open" | "closing-soon" | "closed" | "evaluation"
}

export default function TenderManagement() {
  const [tenders, setTenders] = useState<Tender[]>([
    {
      id: "TND-2025-001",
      title: "Infrastructure Development Project Phase 1",
      postedDate: new Date("2025-01-15"),
      closingDate: new Date("2025-02-15"),
      clarificationCutoff: new Date("2025-02-08"),
      submissions: 12,
      status: "open",
    },
    {
      id: "TND-2025-002",
      title: "IT Systems Upgrade and Integration",
      postedDate: new Date("2025-01-20"),
      closingDate: new Date("2025-01-25"),
      clarificationCutoff: new Date("2025-01-23"),
      submissions: 8,
      status: "closing-soon",
    },
    {
      id: "TND-2024-087",
      title: "Building Maintenance Services Contract",
      postedDate: new Date("2024-12-01"),
      closingDate: new Date("2025-01-10"),
      clarificationCutoff: new Date("2025-01-05"),
      submissions: 24,
      status: "closed",
    },
  ])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Auto-move closed tenders to evaluation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTenders((prevTenders) =>
        prevTenders.map((tender) => {
          if (tender.closingDate < now && tender.status !== "evaluation" && tender.status !== "closed") {
            return { ...tender, status: "closed" }
          }
          // Auto move to evaluation after 1 minute of being closed (for demo)
          if (tender.status === "closed" && tender.closingDate < new Date(now.getTime() - 60000)) {
            return { ...tender, status: "evaluation" }
          }
          return tender
        }),
      )
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    // Simulate refresh
    console.log("[v0] Refreshing tenders list")
  }

  const handleAddTender = (tender: Omit<Tender, "id" | "submissions" | "status">) => {
    const newTender: Tender = {
      ...tender,
      id: `TND-2025-${String(tenders.length + 1).padStart(3, "0")}`,
      submissions: 0,
      status: "open",
    }
    setTenders([newTender, ...tenders])
    setIsUploadModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">Tender Management</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage procurement tenders and submissions</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={() => setIsUploadModalOpen(true)} variant="default">
              Upload Tender
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Tender</TableHead>
                <TableHead className="text-muted-foreground font-medium">Posted</TableHead>
                <TableHead className="text-muted-foreground font-medium">Closes (Countdown)</TableHead>
                <TableHead className="text-muted-foreground font-medium text-center">Submissions</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => (
                <TenderRow key={tender.id} tender={tender} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <UploadTenderModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} onSubmit={handleAddTender} />
    </div>
  )
}

function TenderRow({ tender }: { tender: Tender }) {
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const diff = tender.closingDate.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown("Closed")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setCountdown(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`)
      } else {
        setCountdown(`${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [tender.closingDate])

  const getStatusBadge = () => {
    switch (tender.status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Open
          </Badge>
        )
      case "closing-soon":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Closing Soon
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Closed
          </Badge>
        )
      case "evaluation":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Evaluation
          </Badge>
        )
    }
  }

  return (
    <TableRow className="border-b border-border">
      <TableCell>
        <div>
          <div className="font-medium text-foreground">{tender.id}</div>
          <div className="text-sm text-muted-foreground">{tender.title}</div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {tender.postedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm text-foreground">
            {tender.closingDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">{countdown}</div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <span className="text-foreground font-medium">{tender.submissions}</span>
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
