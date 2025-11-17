import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, FileText, Calendar } from "lucide-react"

export default function KYCPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6 hover:bg-primary/10">
          <Link href="/provider">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-foreground">KYC Verification</h1>
            <Badge className="bg-green-600 text-white border-none">Verified</Badge>
          </div>
          <p className="text-muted-foreground">Your Know Your Customer verification details</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-card-foreground">Personal Information</CardTitle>
                  <CardDescription>Your identity verification details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-base font-medium text-foreground">John Michael Smith</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-base font-medium text-foreground">January 15, 1990</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                  <p className="text-base font-medium text-foreground">United States</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Type</label>
                  <p className="text-base font-medium text-foreground">Passport</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-card-foreground">Verification Status</CardTitle>
                  <CardDescription>Current status of your KYC verification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Identity Verified</p>
                  <p className="text-sm text-muted-foreground">Your identity has been successfully verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Documents Approved</p>
                  <p className="text-sm text-muted-foreground">
                    All submitted documents have been reviewed and approved
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Verified On</p>
                  <p className="text-sm text-muted-foreground">March 15, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Documents */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-card-foreground">Submitted Documents</CardTitle>
                  <CardDescription>Documents provided for verification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Passport - Front</p>
                    <p className="text-sm text-muted-foreground">Uploaded on Mar 10, 2024</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                  Approved
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Proof of Address</p>
                    <p className="text-sm text-muted-foreground">Uploaded on Mar 10, 2024</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                  Approved
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
            <Link href="/provider/kyc/update">Update KYC Information</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
