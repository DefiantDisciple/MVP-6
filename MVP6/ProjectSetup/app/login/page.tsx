"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Role } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const returnUrl = searchParams.get("returnUrl") || null

  const handleLogin = async (role: Role) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `demo@${role}.com`,
          password: "demo123",
          role,
        }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
        variant: "default",
      })

      // Redirect based on role or return URL
      if (returnUrl && returnUrl.startsWith(`/${role}`)) {
        router.push(returnUrl)
      } else {
        router.push(`/${role}/dashboard`)
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">TenderHub</h1>
          <p className="text-muted-foreground">Government Procurement Platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Entity Login */}
          <Card>
            <CardHeader>
              <CardTitle>Entity Portal</CardTitle>
              <CardDescription>For government entities publishing and managing tenders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value="demo@entity.com" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value="demo123" disabled className="bg-muted" />
              </div>
              <Button onClick={() => handleLogin("entity")} disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login as Entity"}
              </Button>
            </CardContent>
          </Card>

          {/* Provider Login */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Portal</CardTitle>
              <CardDescription>For service providers submitting bids and proposals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value="demo@provider.com" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value="demo123" disabled className="bg-muted" />
              </div>
              <Button onClick={() => handleLogin("provider")} disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login as Provider"}
              </Button>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Platform administration and oversight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value="demo@admin.com" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value="demo123" disabled className="bg-muted" />
              </div>
              <Button onClick={() => handleLogin("admin")} disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login as Admin"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo environment - Click any role to explore the platform
        </p>
      </div>
    </div>
  )
}
