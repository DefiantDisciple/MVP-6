"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/utils"
import { FileText, Download, CheckCircle } from "lucide-react"
import type { Receipt } from "@/lib/types"

interface SubmissionReceiptsProps {
  receipts: Receipt[]
}

export function SubmissionReceipts({ receipts }: SubmissionReceiptsProps) {
  const handleDownloadReceipt = (receipt: Receipt) => {
    // In a real app, generate and download PDF receipt
    console.log("[v0] Downloading receipt:", receipt.receiptNumber)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submission Receipts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {receipts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No receipts available</div>
          ) : (
            receipts.map((receipt) => (
              <div key={receipt.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{receipt.receiptNumber}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(receipt.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {receipt.type.replace(/_/g, " ")}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(receipt)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
