import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "credit",
    amount: 1250.0,
    description: "Payment received - Invoice #1234",
    date: "Mar 22, 2024",
    status: "completed",
  },
  {
    id: 2,
    type: "debit",
    amount: 350.0,
    description: "Service fee - Monthly subscription",
    date: "Mar 20, 2024",
    status: "completed",
  },
  {
    id: 3,
    type: "credit",
    amount: 2500.0,
    description: "Payment received - Invoice #1233",
    date: "Mar 18, 2024",
    status: "completed",
  },
  { id: 4, type: "debit", amount: 125.0, description: "Transaction fee", date: "Mar 15, 2024", status: "completed" },
  {
    id: 5,
    type: "credit",
    amount: 3400.0,
    description: "Payment received - Invoice #1232",
    date: "Mar 12, 2024",
    status: "completed",
  },
]

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" asChild className="mb-6 hover:bg-primary/10">
          <Link href="/provider">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Wallet Overview</h1>
          <p className="text-muted-foreground">View your balance and transaction history</p>
        </div>

        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-none">
              <CardHeader className="pb-3">
                <CardDescription className="text-blue-100">Available Balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">$12,345.67</p>
                    <p className="text-sm text-blue-100 mt-1">Ready to withdraw</p>
                  </div>
                  <Wallet className="h-8 w-8 text-white/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardDescription>Total Income (30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">$8,450.00</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <p className="text-sm text-green-600">+12.5%</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardDescription>Total Expenses (30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-destructive">$1,250.00</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="h-3 w-3 text-destructive" />
                      <p className="text-sm text-destructive">+5.2%</p>
                    </div>
                  </div>
                  <ArrowDownLeft className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-card-foreground">Transaction History</CardTitle>
                  <CardDescription>Your recent wallet transactions</CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "credit" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                        {transaction.status}
                      </Badge>
                      <p
                        className={`font-semibold text-lg ${transaction.type === "credit" ? "text-green-600" : "text-destructive"}`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-border bg-transparent">
                Load More Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-primary bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Wallet className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Read-Only View</p>
                  <p className="text-sm text-muted-foreground">
                    This is a read-only summary of your wallet. To make withdrawals or deposits, please contact support
                    or visit the payments section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
