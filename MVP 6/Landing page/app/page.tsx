import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, FileText, Users, CheckCircle, Upload, Gavel, ClipboardList, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with authentication buttons */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-xl font-bold">Procurement</div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/signin">Log in with II</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-6 text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight lg:text-6xl">
            Procurement. Simplified. Secured.
          </h1>

          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground lg:text-xl">
            Streamline your procurement process with intelligent automation and robust security protocols
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <Button asChild size="lg" className="group min-w-[200px] text-base">
              <Link href="/signin">
                Get started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="group min-w-[200px] text-base bg-transparent">
              <Link href="/provider/dashboard/open">
                Start a bid
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-primary bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-accent bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Closing Soon</p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-secondary bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-secondary/10 p-3">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-3xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Awarded</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <Card className="bg-muted/50 p-6">
            <h2 className="mb-6 text-center text-xl font-semibold">How it works</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-primary p-4">
                  <Upload className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1 font-semibold">Publish</h3>
                <p className="text-xs text-muted-foreground">Create and publish procurement opportunities</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-primary p-4">
                  <Gavel className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1 font-semibold">Bid</h3>
                <p className="text-xs text-muted-foreground">Vendors submit competitive proposals</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-primary p-4">
                  <ClipboardList className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1 font-semibold">Evaluate</h3>
                <p className="text-xs text-muted-foreground">Review and score submissions</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-primary p-4">
                  <Award className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-1 font-semibold">Award</h3>
                <p className="text-xs text-muted-foreground">Select winner and finalize contract</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved</p>

          <nav className="flex gap-6">
            <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
