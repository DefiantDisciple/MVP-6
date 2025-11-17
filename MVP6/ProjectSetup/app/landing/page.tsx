import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, Clock, Lock, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TenderHub</span>
          </div>
          <Link href="/login">
            <Button>Access Portal</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-balance">Transparent Government Procurement Made Simple</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
          A comprehensive platform for managing the entire tender lifecycle—from publication through evaluation to award
          and escrow management.
        </p>
        {/* Demo Mode Banner */}
        <div className="mb-8 px-6 py-3 bg-blue-100 border border-blue-300 rounded-lg inline-block">
          <p className="text-blue-800 font-medium">
            🚀 <strong>Demo Mode</strong> - Explore all features with mock data
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/entity/dashboard">
            <Button size="lg" className="text-lg px-8">
              Entity Dashboard
            </Button>
          </Link>
          <Link href="/provider/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Provider Dashboard
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Admin Console
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Built for Government Procurement</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>
                End-to-end encryption, sealed bids, and digital signatures ensure integrity throughout the process.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Business Day Tracking</CardTitle>
              <CardDescription>
                Automatic deadline management with business day calculations and countdown timers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Escrow Management</CardTitle>
              <CardDescription>
                Track milestones, payments, and deliverables with transparent escrow event logging.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Document Control</CardTitle>
              <CardDescription>
                File hashing, versioning, and receipts provide complete audit trails for all submissions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Role Access</CardTitle>
              <CardDescription>
                Separate portals for entities, providers, and administrators with role-based permissions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Real-Time Updates</CardTitle>
              <CardDescription>
                Instant notifications and status updates keep all stakeholders informed throughout the process.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-2xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Complete Tender Lifecycle</h2>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Publish Tender</h3>
            <p className="text-sm text-muted-foreground">
              Entities create and publish tenders with requirements and deadlines
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Submit Bids</h3>
            <p className="text-sm text-muted-foreground">Providers submit sealed technical and financial proposals</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Evaluate & Award</h3>
            <p className="text-sm text-muted-foreground">
              Transparent evaluation process with structured scoring criteria
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2">Track Milestones</h3>
            <p className="text-sm text-muted-foreground">
              Monitor project delivery with escrow and milestone management
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Modernize Your Procurement?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join government entities and service providers already using TenderHub for transparent, efficient tender
          management.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/entity/dashboard">
            <Button size="lg" className="text-lg px-8">
              Entity Portal
            </Button>
          </Link>
          <Link href="/provider/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Provider Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-semibold">TenderHub</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 TenderHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
