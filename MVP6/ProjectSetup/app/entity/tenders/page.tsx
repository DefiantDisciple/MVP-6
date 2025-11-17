"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UploadTenderModal } from "@/components/entity/upload-tender-modal"
import { Download, Eye, RefreshCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export type Tender = {
  id: string
  title: string
  postedDate: Date
  closingDate: Date
  clarificationCutoff: Date
  submissions: number
  status: "open" | "closed" | "evaluation" | "notice-to-award" | "active" | "complete"
}

export default function EntityTendersPage() {
  const { toast } = useToast()
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
      id: "TND-2024-087",
      title: "Building Maintenance Services Contract",
      postedDate: new Date("2024-12-01"),
      closingDate: new Date("2025-01-10"),
      clarificationCutoff: new Date("2025-01-05"),
      submissions: 24,
      status: "closed",
    },
    {
      id: "TND-2024-065",
      title: "Road Construction and Rehabilitation",
      postedDate: new Date("2024-11-01"),
      closingDate: new Date("2024-12-15"),
      clarificationCutoff: new Date("2024-12-08"),
      submissions: 18,
      status: "evaluation",
    },
    {
      id: "TND-2024-042",
      title: "Medical Equipment Procurement",
      postedDate: new Date("2024-10-15"),
      closingDate: new Date("2024-11-30"),
      clarificationCutoff: new Date("2024-11-23"),
      submissions: 15,
      status: "notice-to-award",
    },
    {
      id: "TND-2024-028",
      title: "School Building Construction Phase 2",
      postedDate: new Date("2024-09-01"),
      closingDate: new Date("2024-10-15"),
      clarificationCutoff: new Date("2024-10-08"),
      submissions: 22,
      status: "active",
    },
    {
      id: "TND-2024-015",
      title: "Water Supply System Upgrade",
      postedDate: new Date("2024-08-01"),
      closingDate: new Date("2024-09-15"),
      clarificationCutoff: new Date("2024-09-08"),
      submissions: 19,
      status: "complete",
    },
  ])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Note: Removed auto-status-change logic to keep statuses stable

  const handleRefresh = () => {
    // Simulate refresh
    console.log("[v0] Refreshing tenders list")
    toast({
      title: "Refreshed",
      description: "Tenders list has been updated",
    })
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
    toast({
      title: "Success",
      description: "New tender has been uploaded successfully",
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Entity Portal" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/entity/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tender Management</h1>
          <p className="text-slate-600">Monitor and manage procurement tenders and submissions</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={() => setIsUploadModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
              Upload Tender
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tenders Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 hover:bg-transparent">
                <TableHead className="text-slate-600 font-medium">Tender</TableHead>
                <TableHead className="text-slate-600 font-medium">Posted</TableHead>
                <TableHead className="text-slate-600 font-medium">Closes (Countdown)</TableHead>
                <TableHead className="text-slate-600 font-medium text-center">Submissions</TableHead>
                <TableHead className="text-slate-600 font-medium">Status</TableHead>
                <TableHead className="text-slate-600 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenders.map((tender) => (
                <TenderRow key={tender.id} tender={tender} />
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <UploadTenderModal 
        open={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen} 
        onSubmit={handleAddTender} 
      />
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
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Open
          </Badge>
        )
      case "closed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Closed
          </Badge>
        )
      case "evaluation":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Evaluation
          </Badge>
        )
      case "notice-to-award":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Notice to Award
          </Badge>
        )
      case "active":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Active
          </Badge>
        )
      case "complete":
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200">
            Complete
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Unknown
          </Badge>
        )
    }
  }

  return (
    <TableRow className="border-b border-slate-200">
      <TableCell>
        <div>
          <div className="font-medium text-slate-900">{tender.id}</div>
          <div className="text-sm text-slate-600">{tender.title}</div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-slate-600">
        {tender.postedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        <div>
          <div className="text-sm text-slate-900">
            {tender.closingDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-slate-500">{countdown}</div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <span className="text-slate-900 font-medium">{tender.submissions}</span>
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
