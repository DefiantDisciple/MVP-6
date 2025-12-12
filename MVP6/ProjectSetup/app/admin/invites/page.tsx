"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, UserPlus, Building, CheckCircle, Clock, XCircle } from "lucide-react"

interface Invite {
    id: string
    email: string
    role: string
    orgId: string
    organizationName?: string
    token: string
    createdAt: string
    expiresAt: string
    isUsed: boolean
    usedAt?: string
}

interface Organization {
    id: string
    name: string
    type: string
}

export default function AdminInvitesPage() {
    const { toast } = useToast()
    const [invites, setInvites] = useState<Invite[]>([])
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingInvites, setIsLoadingInvites] = useState(true)

    // Form state
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<string>("")
    const [selectedOrgId, setSelectedOrgId] = useState<string>("")
    const [newOrgName, setNewOrgName] = useState("")
    const [newOrgType, setNewOrgType] = useState<string>("")
    const [createNewOrg, setCreateNewOrg] = useState(false)

    // Load organizations and invites
    useEffect(() => {
        loadOrganizations()
        loadInvites()
    }, [])

    const loadOrganizations = async () => {
        try {
            const response = await fetch("/api/organizations")
            if (response.ok) {
                const data = await response.json()
                setOrganizations(data.organizations || [])
            }
        } catch (error) {
            console.error("Failed to load organizations:", error)
        }
    }

    const loadInvites = async () => {
        try {
            setIsLoadingInvites(true)
            const response = await fetch("/api/auth/invite")
            if (response.ok) {
                const data = await response.json()
                setInvites(data.invites || [])
            }
        } catch (error) {
            console.error("Failed to load invites:", error)
        } finally {
            setIsLoadingInvites(false)
        }
    }

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate form
            if (!email || !role) {
                toast({
                    title: "Validation Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                })
                return
            }

            if (createNewOrg) {
                if (!newOrgName || !newOrgType) {
                    toast({
                        title: "Validation Error",
                        description: "Please provide organization name and type",
                        variant: "destructive",
                    })
                    return
                }
            } else {
                if (!selectedOrgId) {
                    toast({
                        title: "Validation Error",
                        description: "Please select an organization",
                        variant: "destructive",
                    })
                    return
                }
            }

            const payload: any = {
                email,
                role,
            }

            if (createNewOrg) {
                payload.organizationName = newOrgName
                payload.organizationType = newOrgType
            } else {
                payload.orgId = selectedOrgId
            }

            const response = await fetch("/api/auth/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send invite")
            }

            toast({
                title: "Invite Sent!",
                description: `Invitation sent to ${email}`,
            })

            // Reset form
            setEmail("")
            setRole("")
            setSelectedOrgId("")
            setNewOrgName("")
            setNewOrgType("")
            setCreateNewOrg(false)

            // Reload data
            loadInvites()
            if (createNewOrg) {
                loadOrganizations()
            }
        } catch (error: any) {
            toast({
                title: "Failed to Send Invite",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyInviteLink = (token: string) => {
        const inviteUrl = `${window.location.origin}/auth/accept-invite?token=${token}`
        navigator.clipboard.writeText(inviteUrl)
        toast({
            title: "Link Copied!",
            description: "Invite link copied to clipboard",
        })
    }

    const getStatusBadge = (invite: Invite) => {
        if (invite.isUsed) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3" />
                    Used
                </span>
            )
        }

        const isExpired = new Date(invite.expiresAt) < new Date()
        if (isExpired) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3" />
                    Expired
                </span>
            )
        }

        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Clock className="h-3 w-3" />
                Pending
            </span>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Invite Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Send invites to new users and manage pending invitations
                    </p>
                </div>
            </div>

            {/* Send New Invite Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Send New Invite
                    </CardTitle>
                    <CardDescription>
                        Invite users to join organizations on the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSendInvite} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Role *</Label>
                                <Select value={role} onValueChange={setRole} required>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entity">Entity (Procuring Organization)</SelectItem>
                                        <SelectItem value="provider">Provider (Service Provider)</SelectItem>
                                        <SelectItem value="admin">Admin (Platform Administrator)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Organization Selection */}
                        <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <Label className="text-base font-semibold">Organization</Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={!createNewOrg}
                                        onChange={() => setCreateNewOrg(false)}
                                        className="w-4 h-4"
                                    />
                                    <span>Existing Organization</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={createNewOrg}
                                        onChange={() => setCreateNewOrg(true)}
                                        className="w-4 h-4"
                                    />
                                    <span>Create New Organization</span>
                                </label>
                            </div>

                            {!createNewOrg ? (
                                <div className="space-y-2">
                                    <Label htmlFor="organization">Select Organization *</Label>
                                    <Select value={selectedOrgId} onValueChange={setSelectedOrgId} required={!createNewOrg}>
                                        <SelectTrigger id="organization">
                                            <SelectValue placeholder="Choose an organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {organizations.filter(org => !org.id.includes('-demo')).map((org) => (
                                                <SelectItem key={org.id} value={org.id}>
                                                    {org.name} ({org.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newOrgName">Organization Name *</Label>
                                        <Input
                                            id="newOrgName"
                                            placeholder="e.g., Ministry of Health"
                                            value={newOrgName}
                                            onChange={(e) => setNewOrgName(e.target.value)}
                                            required={createNewOrg}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newOrgType">Organization Type *</Label>
                                        <Select value={newOrgType} onValueChange={setNewOrgType} required={createNewOrg}>
                                            <SelectTrigger id="newOrgType">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="entity">Entity</SelectItem>
                                                <SelectItem value="provider">Provider</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            {isLoading ? "Sending Invite..." : "Send Invite"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Pending Invites List */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending Invites</CardTitle>
                    <CardDescription>
                        View and manage all sent invitations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingInvites ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading invites...
                        </div>
                    ) : invites.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No invites sent yet. Create your first invite above.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invites.map((invite) => (
                                <div
                                    key={invite.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium">{invite.email}</p>
                                            {getStatusBadge(invite)}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span>Role: <strong>{invite.role}</strong></span>
                                            <span>•</span>
                                            <span>Org: <strong>{invite.organizationName || invite.orgId}</strong></span>
                                            <span>•</span>
                                            <span>Sent: {new Date(invite.createdAt).toLocaleDateString()}</span>
                                            {invite.isUsed && invite.usedAt && (
                                                <>
                                                    <span>•</span>
                                                    <span>Used: {new Date(invite.usedAt).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {!invite.isUsed && new Date(invite.expiresAt) > new Date() && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyInviteLink(invite.token)}
                                        >
                                            Copy Link
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
