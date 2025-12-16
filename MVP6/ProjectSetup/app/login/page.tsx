"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Fingerprint, Loader2 } from "lucide-react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const returnUrl = searchParams.get("returnUrl") || null
  const tabParam = searchParams.get("tab") || null
  const isDemoMode = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'false'
  const defaultTab = tabParam || "login"

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
        variant: "default",
      })

      // Redirect based on role or return URL (force full reload for middleware)
      const userRole = data.user.role
      if (returnUrl && returnUrl.startsWith(`/${userRole}`)) {
        window.location.href = returnUrl
      } else {
        window.location.href = `/${userRole}/dashboard`
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail,
          password: "demo123",
        }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      toast({
        title: "Demo login successful",
        description: `Logged in as ${data.user.name}`,
        variant: "default",
      })

      // Force navigation with full page reload to ensure middleware processes cookies
      window.location.href = `/${data.user.role}/dashboard`
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Demo login unavailable.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleIILogin = async () => {
    setIsLoading(true)

    try {
      // Dynamically import II module (client-side only)
      const { loginWithII } = await import("@/lib/auth/internet-identity")

      // Open Internet Identity authentication
      const principal = await loginWithII()

      if (!principal) {
        throw new Error("No principal received from Internet Identity")
      }

      // Send principal to backend
      const response = await fetch("/api/auth/ii-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ principal }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.needsLinking) {
          toast({
            title: "Account not found",
            description: "No account is linked to this Internet Identity. Please contact your administrator.",
            variant: "destructive",
          })
        } else {
          throw new Error(data.error || "Login failed")
        }
        return
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
        variant: "default",
      })

      // Redirect to dashboard
      window.location.href = `/${data.user.role}/dashboard`
    } catch (error: any) {
      console.error("II login error:", error)
      toast({
        title: "Internet Identity login failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">VerDEX Systems</h1>
          <p className="text-muted-foreground">Procurement Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              {isDemoMode ? "Demo mode - Use demo accounts below" : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="demo">Demo</TabsTrigger>
              </TabsList>

              {/* Real Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleRealLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleIILogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Fingerprint className="mr-2 h-4 w-4" />
                  {isLoading ? "Connecting..." : "Sign in with Internet Identity"}
                </Button>

                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Access is invite-only. Contact your administrator if you need an account.
                </p>
              </TabsContent>

              {/* Demo Login Tab */}
              <TabsContent value="demo" className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Quick access demo accounts for platform exploration
                </p>

                <Button
                  type="button"
                  onClick={() => handleDemoLogin("demo@entity.com")}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                >
                  {isLoading ? "Loading..." : "Demo Entity User"}
                </Button>

                <Button
                  type="button"
                  onClick={() => handleDemoLogin("demo@provider.com")}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
                >
                  {isLoading ? "Loading..." : "Demo Provider User"}
                </Button>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Demo data shown - Not connected to real organizations
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/landing" className="text-sm text-muted-foreground hover:underline">
            ← Back to landing page
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
