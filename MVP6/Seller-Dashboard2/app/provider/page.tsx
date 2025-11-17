import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Building2, Wallet, Bell, CheckCircle2, AlertCircle, FileText, Scale } from "lucide-react"

export default function ProviderHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your provider account and verification status</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* KYC Card */}
          <Card className="hover:shadow-lg transition-all hover:border-primary bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-card-foreground">KYC Verification</CardTitle>
              <CardDescription>Know Your Customer verification status and documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Status: <span className="font-medium text-green-600">Verified</span>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/provider/kyc">View Details</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  <Link href="/provider/kyc/update">Update</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* KYB Card */}
          <Card className="hover:shadow-lg transition-all hover:border-primary bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-card-foreground">KYB Verification</CardTitle>
              <CardDescription>Know Your Business verification and company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Status: <span className="font-medium text-blue-600">Pending Review</span>
              </div>
              <div className="flex gap-2">
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/provider/kyb">View Details</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  <Link href="/provider/kyb/update">Update</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card className="hover:shadow-lg transition-all hover:border-primary bg-card">
            <CardHeader>
              <div className="rounded-lg bg-primary/10 p-2 w-fit">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Wallet</CardTitle>
              <CardDescription>View your wallet balance and transaction history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-foreground">$12,345.67</div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/provider/wallet">View Wallet</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="hover:shadow-lg transition-all hover:border-primary bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">3</span>
              </div>
              <CardTitle className="text-card-foreground">Notifications</CardTitle>
              <CardDescription>Stay updated with important alerts and messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">You have 3 unread notifications</div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/provider/notifications">View All</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">5</span>
              </div>
              <CardTitle className="text-card-foreground">Tenders</CardTitle>
              <CardDescription>Browse and respond to available tenders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">5 active tenders available</div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/provider/tenders">View Tenders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:border-primary bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">2</span>
              </div>
              <CardTitle className="text-card-foreground">My Disputes</CardTitle>
              <CardDescription>Manage and track your dispute cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">2 open disputes</div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/provider/disputes">View Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
