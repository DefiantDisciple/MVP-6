"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { escrowAdapter, EscrowHelpers, type EscrowDetails, type EscrowStatus } from "@/lib/escrow-adapter"
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Search,
  Plus,
  Eye
} from "lucide-react"

interface EscrowManagementProps {
  className?: string
}

export function EscrowManagement({ className }: EscrowManagementProps) {
  const [escrows, setEscrows] = useState<EscrowDetails[]>([])
  const [filteredEscrows, setFilteredEscrows] = useState<EscrowDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowDetails | null>(null)
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false)
  const [operationType, setOperationType] = useState<string>("")
  const [operationParams, setOperationParams] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadEscrows()
  }, [])

  useEffect(() => {
    filterEscrows()
  }, [escrows, searchTerm, statusFilter])

  const loadEscrows = async () => {
    try {
      setIsLoading(true)
      // In a real implementation, this would call the escrow adapter
      // For now, we'll use mock data
      const mockEscrows: EscrowDetails[] = [
        {
          ref: "ESC-001-TND001",
          tender_id: BigInt(1),
          amount: BigInt(500000000), // 5M BWP in cents
          currency: "BWP",
          status: "created",
          created_ts: BigInt(Date.now() - 86400000),
          updated_ts: BigInt(Date.now() - 86400000),
          metadata: {}
        },
        {
          ref: "ESC-002-TND002", 
          tender_id: BigInt(2),
          amount: BigInt(250000000), // 2.5M BWP in cents
          currency: "BWP",
          status: "held",
          created_ts: BigInt(Date.now() - 172800000),
          updated_ts: BigInt(Date.now() - 3600000),
          milestone_id: "MS-001",
          metadata: {}
        },
        {
          ref: "ESC-003-TND003",
          tender_id: BigInt(3), 
          amount: BigInt(750000000), // 7.5M BWP in cents
          currency: "BWP",
          status: "released",
          created_ts: BigInt(Date.now() - 259200000),
          updated_ts: BigInt(Date.now() - 7200000),
          metadata: {}
        }
      ]
      setEscrows(mockEscrows)
    } catch (error) {
      console.error("Failed to load escrows:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEscrows = () => {
    let filtered = escrows

    if (searchTerm) {
      filtered = filtered.filter(escrow => 
        escrow.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.tender_id.toString().includes(searchTerm)
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(escrow => escrow.status === statusFilter)
    }

    setFilteredEscrows(filtered)
  }

  const getStatusIcon = (status: EscrowStatus) => {
    switch (status) {
      case "created":
        return <ArrowDownCircle className="h-4 w-4 text-blue-600" />
      case "held":
        return <Lock className="h-4 w-4 text-yellow-600" />
      case "released":
        return <ArrowUpCircle className="h-4 w-4 text-green-600" />
      case "refunded":
        return <Unlock className="h-4 w-4 text-orange-600" />
      case "disputed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      default:
        return <ArrowDownCircle className="h-4 w-4" />
    }
  }

  const getStatusBadgeVariant = (status: EscrowStatus) => {
    switch (status) {
      case "created": return "default"
      case "held": return "secondary" 
      case "released": return "default"
      case "refunded": return "secondary"
      case "disputed": return "destructive"
      case "resolved": return "default"
      default: return "secondary"
    }
  }

  const handleOperation = async () => {
    if (!selectedEscrow || !operationType) return

    try {
      setIsProcessing(true)
      
      const response = await fetch("/api/escrow/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: operationType,
          escrowRef: selectedEscrow.ref,
          ...operationParams
        })
      })

      const result = await response.json()

      if (result.success) {
        setIsOperationModalOpen(false)
        setOperationType("")
        setOperationParams({})
        setSelectedEscrow(null)
        await loadEscrows() // Reload data
      } else {
        console.error("Operation failed:", result.error)
      }
    } catch (error) {
      console.error("Operation error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const openOperationModal = (escrow: EscrowDetails, operation: string) => {
    setSelectedEscrow(escrow)
    setOperationType(operation)
    setOperationParams({})
    setIsOperationModalOpen(true)
  }

  const renderOperationForm = () => {
    switch (operationType) {
      case "hold":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="milestoneId">Milestone ID</Label>
              <Input
                id="milestoneId"
                value={operationParams.milestoneId || ""}
                onChange={(e) => setOperationParams(prev => ({ ...prev, milestoneId: e.target.value }))}
                placeholder="Enter milestone ID"
              />
            </div>
          </div>
        )
      
      case "refund":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Refund Reason</Label>
              <Textarea
                id="reason"
                value={operationParams.reason || ""}
                onChange={(e) => setOperationParams(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for refund"
                rows={3}
              />
            </div>
          </div>
        )
      
      case "dispute":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="disputeId">Dispute ID</Label>
              <Input
                id="disputeId"
                value={operationParams.disputeId || ""}
                onChange={(e) => setOperationParams(prev => ({ ...prev, disputeId: e.target.value }))}
                placeholder="Enter dispute ID"
              />
            </div>
          </div>
        )
      
      case "resolve":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="resolution">Resolution Details</Label>
              <Textarea
                id="resolution"
                value={operationParams.resolution || ""}
                onChange={(e) => setOperationParams(prev => ({ ...prev, resolution: e.target.value }))}
                placeholder="Enter resolution details"
                rows={3}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  const getAvailableOperations = (status: EscrowStatus) => {
    switch (status) {
      case "created":
        return ["hold", "release", "refund", "dispute"]
      case "held":
        return ["release", "refund", "dispute"]
      case "disputed":
        return ["resolve", "refund"]
      default:
        return []
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Escrow Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading escrows...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Escrow Management</CardTitle>
          <Button onClick={loadEscrows} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by escrow ref or tender ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="held">Held</SelectItem>
              <SelectItem value="released">Released</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Escrows Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escrow Reference</TableHead>
                <TableHead>Tender ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEscrows.map((escrow) => (
                <TableRow key={escrow.ref}>
                  <TableCell className="font-mono text-sm">{escrow.ref}</TableCell>
                  <TableCell>TND-{escrow.tender_id.toString().padStart(3, '0')}</TableCell>
                  <TableCell>{formatCurrency(Number(escrow.amount) / 100)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(escrow.status as EscrowStatus)}
                      <Badge variant={getStatusBadgeVariant(escrow.status as EscrowStatus)}>
                        {escrow.status.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(new Date(Number(escrow.created_ts)))}</TableCell>
                  <TableCell>{formatDate(new Date(Number(escrow.updated_ts)))}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {getAvailableOperations(escrow.status as EscrowStatus).map((operation) => (
                        <Button
                          key={operation}
                          variant="outline"
                          size="sm"
                          onClick={() => openOperationModal(escrow, operation)}
                        >
                          {operation === "release" && <ArrowUpCircle className="h-3 w-3 mr-1" />}
                          {operation === "hold" && <Lock className="h-3 w-3 mr-1" />}
                          {operation === "refund" && <Unlock className="h-3 w-3 mr-1" />}
                          {operation === "dispute" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {operation === "resolve" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {operation.charAt(0).toUpperCase() + operation.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredEscrows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No escrows found matching your criteria
          </div>
        )}
      </CardContent>

      {/* Operation Modal */}
      <Dialog open={isOperationModalOpen} onOpenChange={setIsOperationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {operationType.charAt(0).toUpperCase() + operationType.slice(1)} Escrow
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEscrow && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm space-y-1">
                  <div><strong>Escrow:</strong> {selectedEscrow.ref}</div>
                  <div><strong>Amount:</strong> {formatCurrency(Number(selectedEscrow.amount) / 100)}</div>
                  <div><strong>Status:</strong> {selectedEscrow.status}</div>
                </div>
              </div>
            )}
            
            {renderOperationForm()}
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleOperation} 
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Confirm ${operationType.charAt(0).toUpperCase() + operationType.slice(1)}`
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsOperationModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
