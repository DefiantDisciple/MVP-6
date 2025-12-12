# VerDEX Multi-Tenant Transformation

## Overview

This document describes the multi-tenant, invite-only authentication system implemented for VerDEX Systems platform.

## Architecture

### Core Principles

1. **Multi-Tenancy**: Each user belongs to exactly one organization
2. **Data Isolation**: Users only see data for their organization
3. **Invite-Only**: No public registration; users must be invited
4. **Dual Authentication**: Supports both Classic Auth (email/password) and Internet Identity
5. **Role-Based Access**: Admin, Entity, and Provider roles with strict permissions

### Data Models

#### User
```typescript
{
  id: string
  email: string
  name: string
  role: "admin" | "entity" | "provider"
  orgId: string                // Required for multi-tenancy
  authMethod: "classic" | "ii" | "both"
  iiPrincipal?: string        // Internet Identity principal (optional)
  passwordHash?: string       // For classic auth
  organizationName?: string
  isActive: boolean
  invitedBy?: string
  createdAt: Date
  updatedAt: Date
}
```

#### Organization
```typescript
{
  id: string
  name: string
  type: "entity" | "provider"
  createdAt: Date
  updatedAt: Date
}
```

#### InviteToken
```typescript
{
  id: string
  email: string
  role: "admin" | "entity" | "provider"
  orgId: string
  invitedBy: string
  token: string
  expiresAt: Date
  isUsed: boolean
  usedAt?: Date
  createdAt: Date
}
```

## Authentication Flow

### 1. Classic Authentication (Email + Password)

**Login Endpoint**: `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response**:
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "entity",
    "orgId": "org-456",
    "organizationName": "Ministry of Infrastructure",
    "authMethod": "classic"
  }
}
```

Session stored in HTTP-only cookies:
- `user_role`: User's role
- `user_id`: User ID
- `org_id`: Organization ID

### 2. Invite System

**Create Invite** (Admin or Entity Org Admin only):
`POST /api/auth/invite`
```json
{
  "email": "newuser@example.com",
  "role": "entity",
  "orgId": "org-123"
}
```

**Accept Invite**:
1. User receives invite link: `/auth/accept-invite?token=...`
2. User fills in name and password
3. Account created automatically
4. User redirected to login

### 3. Internet Identity (Future)

Planned integration with IC Internet Identity for passwordless authentication.

## Data Isolation

All data queries are automatically scoped by organization:

### Entity Users
- See only tenders created by their organization
- See bids submitted to their tenders
- See milestones for their awarded contracts

### Provider Users
- See all published/active tenders (for bidding)
- See only their own bids
- See milestones for their won contracts

### Admin
- Has global visibility
- Can access all organizations' data
- Platform oversight and management

### Implementation

Use the data isolation utilities in `/lib/data/isolation.ts`:

```typescript
import { filterTendersByOrg } from "@/lib/data/isolation"

const visibleTenders = filterTendersByOrg(
  allTenders,
  userRole,
  userOrgId
)
```

## Permissions

### Admin
- Full system access
- Can invite any user to any organization
- Can assign any role (including Admin)
- Global data visibility

### Entity Org Admin (Entity User)
- Can invite users to their organization only
- Cannot assign Admin role
- Can manage their organization's tenders
- See bids for their tenders only

### Entity User
- Cannot invite users
- Can view/manage their organization's tenders
- See bids for their organization's tenders

### Provider
- Cannot invite users
- Can view published tenders
- Can submit bids
- See only their own bids and awards

## Demo vs Live Mode

### Demo Mode
Set `NEXT_PUBLIC_ENABLE_AUTH=false` to disable authentication and allow direct dashboard access.

**Demo Users**:
- `demo@entity.com` / `demo123` - Demo Entity User
- `demo@provider.com` / `demo123` - Demo Provider User
- `founder@verdex.systems` / `demo123` - Founder Admin

### Live Mode (Production)
Set `NEXT_PUBLIC_ENABLE_AUTH=true` (or omit, defaults to true).

- All routes protected by authentication
- Invite-only onboarding
- Full multi-tenant data isolation
- Role-based access control

## Founder Admin

There is exactly **one** founder admin user:

**Email**: `founder@verdex.systems`  
**Password**: `demo123` (change in production!)  
**Role**: admin  
**Auth Methods**: Both Classic and Internet Identity  
**Organization**: VerDEX Platform Administration

The founder admin has:
- Full platform access
- Ability to create new organizations
- Ability to invite users to any organization
- Global data visibility

## File Structure

```
lib/
  auth/
    session.ts         # Session management utilities
    utils.ts           # Auth helper functions (hashing, validation)
  data/
    isolation.ts       # Multi-tenant data filtering
  db/
    store.ts           # In-memory data store (replace with DB)
  types.ts             # Core type definitions

app/
  api/
    auth/
      login/route.ts          # Classic auth login
      logout/route.ts         # Session termination
      invite/route.ts         # Create & list invites
      accept-invite/route.ts  # Complete registration
  auth/
    accept-invite/page.tsx    # Invite acceptance UI
  login/page.tsx              # Login UI
  landing/page.tsx            # Landing page

middleware.ts         # Route protection & role checks
```

## Routes

### Public Routes (No Auth Required)
- `/landing` - Landing page
- `/login` - Login page
- `/auth/accept-invite` - Accept invite page
- `/api/auth/*` - Auth API routes

### Protected Routes
- `/admin/*` - Admin only
- `/entity/*` - Entity users only (+ Admin)
- `/provider/*` - Provider users only (+ Admin)

### Demo Routes
- `/demo/*` - Always accessible (future demo area)

## Environment Variables

```bash
# Authentication toggle
NEXT_PUBLIC_ENABLE_AUTH=true  # Enable auth (default: true)

# App URL (for invite links)
NEXT_PUBLIC_APP_URL=https://verdex.systems

# IC Configuration (for Internet Identity)
NEXT_PUBLIC_IC_HOST=https://ic0.app
NEXT_PUBLIC_PREVIEW_MODE=false
```

## Migration from Demo to Production

1. **Create founder admin account** with secure password
2. **Set environment variables** for production
3. **Replace in-memory store** with real database
4. **Implement bcrypt** for password hashing (replace crypto.sha256)
5. **Set up email service** for invite notifications
6. **Configure Internet Identity** integration
7. **Add rate limiting** and security headers
8. **Implement audit logging** for all actions

## Security Considerations

### Current Implementation (Demo)
- ⚠️ Uses simple crypto.sha256 for password hashing
- ⚠️ In-memory storage (data lost on restart)
- ⚠️ No email verification
- ⚠️ No rate limiting

### Production Requirements
- ✅ Use bcrypt/argon2 for password hashing
- ✅ Implement persistent database (PostgreSQL/IC Canister)
- ✅ Add email verification for invites
- ✅ Implement rate limiting on auth endpoints
- ✅ Add CSRF protection
- ✅ Implement session expiry and refresh
- ✅ Add 2FA support
- ✅ Audit log all sensitive actions

## Testing

### Test Accounts

**Founder Admin:**
- Email: `founder@verdex.systems`
- Password: `demo123`
- Organization: VerDEX Platform Administration
- Role: admin

**Demo Entity:**
- Email: `demo@entity.com`
- Password: `demo123`
- Organization: Ministry of Infrastructure (Demo)
- Role: entity

**Demo Provider:**
- Email: `demo@provider.com`
- Password: `demo123`
- Organization: BuildCorp Services Ltd (Demo)
- Role: provider

### Test Invite Flow

1. Login as founder admin
2. Create invite via API or admin dashboard
3. Open invite link in private/incognito window
4. Complete registration
5. Login with new credentials
6. Verify data isolation (should only see org-specific data)

## API Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "founder@verdex.systems",
    "password": "demo123"
  }'
```

### Create Invite
```bash
curl -X POST http://localhost:3000/api/auth/invite \
  -H "Content-Type: application/json" \
  -H "Cookie: user_id=...; user_role=admin; org_id=..." \
  -d '{
    "email": "newuser@example.com",
    "role": "entity",
    "orgId": "org-entity-demo"
  }'
```

### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: user_id=...; user_role=...; org_id=..."
```

## Next Steps

1. **Replace in-memory store** with Supabase/PostgreSQL or IC Canisters
2. **Implement Internet Identity** authentication
3. **Add email service** for invite notifications
4. **Create admin dashboard** for user/org management
5. **Implement audit logging** system
6. **Add organization settings** page
7. **Create user profile** management
8. **Implement password reset** flow
9. **Add session management** dashboard
10. **Deploy to production** with proper secrets management

## Support

For questions or issues, contact the development team or refer to the main project documentation.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Ready for integration testing
