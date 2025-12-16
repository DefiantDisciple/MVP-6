"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Loader2, Fingerprint } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AcceptInvitePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    const token = searchParams.get("token")

    const [isVerifying, setIsVerifying] = React.useState(true)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [inviteData, setInviteData] = React.useState<any>(null)
    const [error, setError] = React.useState<string | null>(null)

    const [name, setName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [authMethod, setAuthMethod] = React.useState<"password" | "ii">("password")

    // Verify invite token on mount
    React.useEffect(() => {
        if (!token) {
            setError("No invite token provided")
            setIsVerifying(false)
            return
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/accept-invite?token=${token}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Invalid invite")
                }

                setInviteData(data.invite)
            } catch (err: any) {
                setError(err.message || "Failed to verify invite")
            } finally {
                setIsVerifying(false)
            }
        }

        verifyToken()
    }, [token])

    const handleIISignup = async () => {
        if (!name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter your full name",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Get II principal
            const { loginWithII } = await import("@/lib/auth/internet-identity")
            const principal = await loginWithII()

            if (!principal) {
                throw new Error("No principal received from Internet Identity")
            }

            // Create account with II
            const response = await fetch("/api/auth/accept-invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, name, iiPrincipal: principal }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create account")
            }

            toast({
                title: "Account created!",
                description: "Your account has been created with Internet Identity",
                variant: "default",
            })

            // Redirect to login
            setTimeout(() => {
                router.push("/login")
            }, 1500)
        } catch (err: any) {
            toast({
                title: "Failed to create account",
                description: err.message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: "Password mismatch",
                description: "Passwords do not match",
                variant: "destructive",
            })
            return
        }

        if (password.length < 8) {
            toast({
                title: "Password too short",
                description: "Password must be at least 8 characters",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/auth/accept-invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, name, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create account")
            }

            toast({
                title: "Account created!",
                description: "Your account has been created successfully",
                variant: "default",
            })

            // Redirect to login
            setTimeout(() => {
                router.push("/login")
            }, 1500)
        } catch (err: any) {
            toast({
                title: "Failed to create account",
                description: err.message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Loading state
    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Verifying invite...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Error state
    if (error || !inviteData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <CardTitle>Invalid Invite</CardTitle>
                        </div>
                        <CardDescription>{error || "This invite link is invalid or has expired"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/login")} className="w-full">
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Success form
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">VerDEX Systems</h1>
                    <p className="text-muted-foreground">Complete your account setup</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <CardTitle>Valid Invite</CardTitle>
                        </div>
                        <CardDescription>
                            You've been invited to join <strong>{inviteData.organizationName}</strong> as a{" "}
                            <strong>{inviteData.role}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="password" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="password">Password</TabsTrigger>
                                <TabsTrigger value="ii">Internet Identity</TabsTrigger>
                            </TabsList>

                            {/* Password Signup Tab */}
                            <TabsContent value="password">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={inviteData.email}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Create a password (min 8 characters)"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Internet Identity Signup Tab */}
                            <TabsContent value="ii" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-ii">Email</Label>
                                    <Input
                                        id="email-ii"
                                        type="email"
                                        value={inviteData.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name-ii">Full Name</Label>
                                    <Input
                                        id="name-ii"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-900">
                                        <strong>Using Internet Identity:</strong><br />
                                        You'll be prompted to create or use your existing Internet Identity to secure your account.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleIISignup}
                                    disabled={isSubmitting || !name.trim()}
                                    className="w-full"
                                >
                                    <Fingerprint className="mr-2 h-4 w-4" />
                                    {isSubmitting ? "Creating account..." : "Create Account with Internet Identity"}
                                </Button>
                            </TabsContent>
                        </Tabs>

                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            By creating an account, you agree to the terms of service
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
