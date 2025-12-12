"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const returnUrl = searchParams.get("returnUrl") || null
  const isDemoMode = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'false'

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

      // Redirect based on role or return URL
      const userRole = data.user.role
      if (returnUrl && returnUrl.startsWith(`/${userRole}`)) {
        router.push(returnUrl)
      } else {
        router.push(`/${userRole}/dashboard`)
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

      router.push(`/${data.user.role}/dashboard`)
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
            <Tabs defaultValue={isDemoMode ? "demo" : "login"} className="w-full">
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
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Access is invite-only. Contact your administrator if you need an account.
                </p>
              </TabsContent>

              {/* Demo Login Tab */}
              <TabsContent value="demo" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Quick access demo accounts for platform exploration
                </p>

                <Button
                  onClick={() => handleDemoLogin("demo@entity.com")}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Demo Entity User
                </Button>

                <Button
                  onClick={() => handleDemoLogin("demo@provider.com")}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Demo Provider User
                </Button>

                <Button
                  onClick={() => handleDemoLogin("founder@verdex.systems")}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Demo Admin User
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
