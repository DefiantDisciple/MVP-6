"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { UserIcon, AlertCircle, Shield, Building, Briefcase, CheckCircle, XCircle } from "lucide-react"
import { formatDate } from "@/lib/date-utils"
import type { User, UserRole, UserStatus } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface PendingRequest {
  id: string
  userId: string
  userName: string
  requestType: "role_change" | "reactivation"
  currentRole?: UserRole
  requestedRole?: UserRole
  requestedAt: string
}

export default function UsersRolesPanel() {
  const { toast } = useToast()
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All")
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    type: "role" | "suspend" | "reactivate"
    value?: UserRole
  } | null>(null)

  // Build query params
  const queryParams = new URLSearchParams()
  if (roleFilter !== "All") queryParams.append("role", roleFilter)
  if (statusFilter !== "All") queryParams.append("status", statusFilter)

  const { data: users, error, isLoading, mutate } = useSWR<User[]>(`/api/users?${queryParams.toString()}`, fetcher)

  const { data: pendingRequests } = useSWR<PendingRequest[]>("/api/users/pending", fetcher)

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setDrawerOpen(true)
  }

  const handleChangeRole = (newRole: UserRole) => {
    setPendingAction({ type: "role", value: newRole })
    setActionDialogOpen(true)
  }

  const handleSuspend = () => {
    setPendingAction({ type: "suspend" })
    setActionDialogOpen(true)
  }

  const handleReactivate = () => {
    setPendingAction({ type: "reactivate" })
    setActionDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedUser || !pendingAction) return

    try {
      const payload: any = { userId: selectedUser.id }

      if (pendingAction.type === "role") {
        payload.action = "change_role"
        payload.newRole = pendingAction.value
      } else if (pendingAction.type === "suspend") {
        payload.action = "suspend"
      } else if (pendingAction.type === "reactivate") {
        payload.action = "reactivate"
      }

      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to update user")

      toast({
        title: "User Updated",
        description: `Successfully updated ${selectedUser.name}`,
      })

      // Refresh data
      mutate()

      // Update selected user
      if (pendingAction.type === "role" && pendingAction.value) {
        setSelectedUser({ ...selectedUser, role: pendingAction.value })
      } else if (pendingAction.type === "suspend") {
        setSelectedUser({ ...selectedUser, status: "suspended" })
      } else if (pendingAction.type === "reactivate") {
        setSelectedUser({ ...selectedUser, status: "active" })
      }

      setActionDialogOpen(false)
      setPendingAction(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "entity":
        return <Building className="h-4 w-4" />
      case "provider":
        return <Briefcase className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-500"
      case "entity":
        return "bg-blue-500"
      case "provider":
        return "bg-green-500"
    }
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "suspended":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{users?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">{users?.filter((u) => u.status === "active").length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Suspended</CardDescription>
            <CardTitle className="text-3xl">{users?.filter((u) => u.status === "suspended").length || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{users?.filter((u) => u.status === "pending").length || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests && pendingRequests.length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>{pendingRequests.length} request(s) awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{request.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.requestType === "role_change"
                          ? `Requesting role change: ${request.currentRole} → ${request.requestedRole}`
                          : "Requesting account reactivation"}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatDate(request.requestedAt)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter users by role and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val as any)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="entity">Entity</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRoleFilter("All")
                setStatusFilter("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>{isLoading ? "Loading..." : `Showing ${users?.length || 0} user(s)`}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load users</span>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}

          {users && users.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Entity/Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <span className="mr-1">{getRoleIcon(user.role)}</span>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.entityOrCompany}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.lastActive)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleViewUser(user)}>
                          <UserIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {users && users.length === 0 && !isLoading && (
            <div className="py-8 text-center text-muted-foreground">No users found matching the filters</div>
          )}
        </CardContent>
      </Card>

      {/* User Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedUser.name}</SheetTitle>
                <SheetDescription>{selectedUser.email}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Profile Snapshot */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">{selectedUser.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <Badge className={getRoleColor(selectedUser.role)}>
                        <span className="mr-1">{getRoleIcon(selectedUser.role)}</span>
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entity/Company:</span>
                      <span>{selectedUser.entityOrCompany}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span>{formatDate(selectedUser.lastActive)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Actions</CardTitle>
                    <CardDescription>All changes will create immutable audit events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Change Role</Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={selectedUser.role === "entity" ? "default" : "outline"}
                          onClick={() => handleChangeRole("entity")}
                          disabled={selectedUser.role === "entity"}
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Entity
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedUser.role === "provider" ? "default" : "outline"}
                          onClick={() => handleChangeRole("provider")}
                          disabled={selectedUser.role === "provider"}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Provider
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedUser.role === "admin" ? "default" : "outline"}
                          onClick={() => handleChangeRole("admin")}
                          disabled={selectedUser.role === "admin"}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <div className="flex gap-2">
                        {selectedUser.status === "active" ? (
                          <Button size="sm" variant="destructive" onClick={handleSuspend}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Suspend Account
                          </Button>
                        ) : (
                          <Button size="sm" variant="default" onClick={handleReactivate}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Reactivate Account
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.type === "role" && (
                <>
                  Are you sure you want to change {selectedUser?.name}'s role to {pendingAction.value}?
                </>
              )}
              {pendingAction?.type === "suspend" && (
                <>Are you sure you want to suspend {selectedUser?.name}'s account?</>
              )}
              {pendingAction?.type === "reactivate" && (
                <>Are you sure you want to reactivate {selectedUser?.name}'s account?</>
              )}{" "}
              This action will create an immutable audit event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
