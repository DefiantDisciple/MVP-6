"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { ArrowDownCircle, ArrowUpCircle, Lock, Unlock, AlertTriangle } from "lucide-react"
import type { EscrowEvent } from "@/lib/types"

interface EscrowLogProps {
  events: EscrowEvent[]
}

export function EscrowLog({ events }: EscrowLogProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getEventIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="h-5 w-5 text-green-600" />
      case "release":
        return <ArrowUpCircle className="h-5 w-5 text-blue-600" />
      case "hold":
        return <Lock className="h-5 w-5 text-yellow-600" />
      case "refund":
        return <Unlock className="h-5 w-5 text-orange-600" />
      case "dispute":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <ArrowDownCircle className="h-5 w-5" />
    }
  }

  const currentBalance = sortedEvents[0]?.balance || 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Escrow Transaction Log</CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(currentBalance)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.map((event) => (
            <div key={event.id} className="flex gap-4 p-4 border border-border rounded-lg">
              <div className="flex-shrink-0 mt-1">{getEventIcon(event.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold">{event.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(event.timestamp)}</p>
                  </div>
                  <Badge variant={event.type === "deposit" ? "default" : "secondary"}>{event.type.toUpperCase()}</Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">{formatCurrency(event.amount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Balance After</p>
                    <p className="font-medium">{formatCurrency(event.balance)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Performed By</p>
                    <p className="font-medium capitalize">{event.performedByRole}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sortedEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No escrow transactions yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
