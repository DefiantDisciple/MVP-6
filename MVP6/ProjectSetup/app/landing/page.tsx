import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Shield, Clock, Lock, TrendingUp, ArrowRight, CheckCircle, Star, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg shadow-blue-glow">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TenderHub
            </span>
          </div>
          <Link href="/login">
            <Button className="shadow-lg hover:shadow-blue-glow transition-all duration-300">
              Access Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium animate-fade-in">
          <Zap className="w-4 h-4 mr-2" />
          Next-Generation Procurement Platform
        </Badge>

        <h1 className="text-6xl md:text-7xl font-bold mb-8 text-balance bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
          Transparent Government Procurement Made Simple
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto text-balance leading-relaxed">
          A comprehensive platform for managing the entire tender lifecycle—from publication through evaluation to award
          and escrow management with blockchain-powered transparency.
        </p>

        {/* Demo Mode Banner */}
        <div className="mb-12 px-8 py-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl inline-block shadow-lg backdrop-blur-sm">
          <p className="text-primary font-semibold text-lg">
            🚀 <strong>Demo Mode Active</strong> - Explore all features with comprehensive mock data
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/entity/dashboard">
            <Button size="lg" className="text-lg px-10 py-4 shadow-blue-glow hover:shadow-blue-glow-lg transition-all duration-300 group">
              Entity Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/provider/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-10 py-4 bg-card/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-all duration-300 group">
              Provider Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-4 bg-secondary/80 hover:bg-secondary transition-all duration-300 group">
              Admin Console
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Enterprise Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Built for Government Procurement
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools designed specifically for transparent, efficient, and compliant procurement processes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary-600 rounded-xl w-fit mb-4 shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">Secure & Compliant</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                End-to-end encryption, sealed bids, and digital signatures ensure integrity throughout the process with blockchain verification.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-accent to-accent-600 rounded-xl w-fit mb-4 shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300">
                <Clock className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">Business Day Tracking</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Automatic deadline management with business day calculations, countdown timers, and intelligent scheduling.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-primary-700 to-primary-800 rounded-xl w-fit mb-4 shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">Escrow Management</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Track milestones, payments, and deliverables with transparent escrow event logging and third-party integration.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl w-fit mb-4 shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300">
                <FileText className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">Document Control</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                File hashing, versioning, and receipts provide complete audit trails for all submissions with immutable records.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl w-fit mb-4 shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">Multi-Role Access</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Separate portals for entities, providers, and administrators with granular role-based permissions and security.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-card-hover transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-xl w-fit mb-4 shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">Real-Time Updates</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Instant notifications and status updates keep all stakeholders informed with live dashboard analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 relative">
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 rounded-3xl p-12 backdrop-blur-sm border border-primary/10 shadow-2xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Process Overview
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Complete Tender Lifecycle
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Streamlined workflow from tender publication to project completion with full transparency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300 group-hover:scale-110">
                  1
                </div>
                {/* Connector line */}
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Publish Tender</h3>
              <p className="text-muted-foreground leading-relaxed">
                Entities create and publish tenders with detailed requirements, specifications, and deadlines
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-600 text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300 group-hover:scale-110">
                  2
                </div>
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Submit Bids</h3>
              <p className="text-muted-foreground leading-relaxed">
                Providers submit sealed technical and financial proposals with secure document encryption
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-800 text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300 group-hover:scale-110">
                  3
                </div>
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary-700/50 to-transparent"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Evaluate & Award</h3>
              <p className="text-muted-foreground leading-relaxed">
                Transparent evaluation process with structured scoring criteria and automated compliance checks
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-600 to-primary-600 text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto shadow-blue-glow group-hover:shadow-blue-glow-lg transition-all duration-300 group-hover:scale-110">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Track Milestones</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor project delivery with integrated escrow management and milestone tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <Badge variant="outline" className="mb-6 px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          Get Started Today
        </Badge>
        
        <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          Ready to Modernize Your Procurement?
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
          Join government entities and service providers already using TenderHub for transparent, efficient, and 
          blockchain-secured tender management processes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link href="/entity/dashboard">
            <Button size="lg" className="text-lg px-12 py-4 shadow-blue-glow hover:shadow-blue-glow-lg transition-all duration-300 group">
              Entity Portal
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/provider/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-12 py-4 bg-card/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-all duration-300 group">
              Provider Portal
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Blockchain Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Real-time Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Compliance Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-gradient-to-r from-card/80 to-secondary/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg shadow-blue-glow">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TenderHub
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-muted-foreground">
              <p>© 2025 TenderHub. All rights reserved.</p>
              <div className="flex gap-4">
                <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
                <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
