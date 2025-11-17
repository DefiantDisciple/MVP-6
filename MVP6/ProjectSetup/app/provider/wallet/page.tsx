"use client"

import React from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wallet, CreditCard, History, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function ProviderWalletPage() {
  const [walletData, setWalletData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/escrow/logs?providerId=PROV-123&summary=true")
      const data = await response.json()
      setWalletData(data.summary)
    } catch (error) {
      console.error("Failed to fetch wallet data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'release':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      case 'hold':
        return <Clock className="h-4 w-4 text-amber-600" />
      default:
        return <Wallet className="h-4 w-4 text-slate-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600'
      case 'release':
        return 'text-blue-600'
      case 'hold':
        return 'text-amber-600'
      default:
        return 'text-slate-600'
    }
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Provider Portal" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/provider/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Wallet & Payments</h1>
          <p className="text-slate-600">Manage your payment methods and transaction history</p>
        </div>

        {/* Wallet Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Balance */}
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Wallet className="h-5 w-5 text-indigo-600" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {isLoading ? "..." : formatCurrency(walletData?.currentBalance || 0)}
                </div>
                <p className="text-slate-600">Available Funds</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Committed */}
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <CreditCard className="h-5 w-5 text-green-600" />
                Total Committed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {isLoading ? "..." : formatCurrency(walletData?.committed || 0)}
                </div>
                <p className="text-slate-600">Contract Value</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Release */}
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Clock className="h-5 w-5 text-amber-600" />
                Pending Release
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-amber-700 mb-2">
                  {isLoading ? "..." : formatCurrency(walletData?.pendingRelease || 0)}
                </div>
                <p className="text-slate-600">Held in Escrow</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <History className="h-5 w-5 text-indigo-600" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Loading transactions...</p>
              </div>
            ) : walletData?.recentTransactions && walletData.recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {walletData.recentTransactions.map((transaction: any, index: number) => (
                  <div key={transaction.id || index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-slate-900">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>{formatDate(transaction.timestamp)}</span>
                          {transaction.tenderId && (
                            <Badge variant="outline" className="text-xs">
                              {transaction.tenderId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'release' ? '+' : transaction.type === 'deposit' ? '+' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <Badge 
                        variant={transaction.type === 'release' ? 'default' : transaction.type === 'deposit' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {transaction.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Transactions Yet</h3>
                <p className="text-slate-600">Your transaction history will appear here once you start receiving payments.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
