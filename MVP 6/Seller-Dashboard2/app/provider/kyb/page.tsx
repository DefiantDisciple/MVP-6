import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, AlertCircle, FileText, Building2 } from "lucide-react"

export default function KYBPage() {
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
            <h1 className="text-4xl font-bold text-foreground">KYB Verification</h1>
            <Badge className="bg-blue-600 text-white border-none">Pending Review</Badge>
          </div>
          <p className="text-muted-foreground">Your Know Your Business verification details</p>
        </div>

        <div className="space-y-6">
          {/* Status Alert */}
          <Card className="border-primary bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Verification In Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Your business documents are currently under review. This typically takes 2-5 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-card-foreground">Company Information</CardTitle>
                  <CardDescription>Your business verification details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <p className="text-base font-medium">Acme Corporation Inc.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                  <p className="text-base font-medium">12-3456789</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Country of Registration</label>
                  <p className="text-base font-medium">United States</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                  <p className="text-base font-medium">Limited Liability Company</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                  <p className="text-base font-medium">123 Business Ave, Suite 100, New York, NY 10001</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Representative Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Authorized Representative</CardTitle>
              <CardDescription>Company representative details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-base font-medium">John Michael Smith</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Position</label>
                  <p className="text-base font-medium">Chief Executive Officer</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base font-medium">john.smith@acmecorp.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-base font-medium">+1 (555) 123-4567</p>
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
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Certificate of Incorporation</p>
                    <p className="text-sm text-muted-foreground">Uploaded on Mar 20, 2024</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                  Under Review
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Business License</p>
                    <p className="text-sm text-muted-foreground">Uploaded on Mar 20, 2024</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                  Under Review
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Tax Registration Document</p>
                    <p className="text-sm text-muted-foreground">Uploaded on Mar 20, 2024</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                  Under Review
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
            <Link href="/provider/kyb/update">Update KYB Information</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
