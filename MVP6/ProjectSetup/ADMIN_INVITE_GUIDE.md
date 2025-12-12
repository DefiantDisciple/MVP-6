# Admin Invite Management Guide

## Overview

The admin dashboard now includes full invite management functionality, allowing you to:
- Send invites to new users
- Assign roles (Entity, Provider, or Admin)
- Create new organizations on-the-fly
- Assign users to existing organizations
- Track all sent invites and their status

## Features

### 1. **Send Invites**
- Navigate to Admin Dashboard → Click **"Invite Users"** button
- Or go directly to: `http://localhost:3000/admin/invites`

### 2. **Invite Form Fields**

**Required Fields:**
- **Email Address**: The recipient's email
- **Role**: Choose from:
  - `Entity` - Procuring organization user
  - `Provider` - Service provider user  
  - `Admin` - Platform administrator

**Organization Options:**
- **Option A: Existing Organization**
  - Select from dropdown of existing organizations
  - Demo organizations are hidden from selection

- **Option B: Create New Organization**
  - Organization Name (e.g., "Ministry of Health")
  - Organization Type (Entity or Provider)
  - The organization will be created automatically

### 3. **Invite Process**

1. Fill out the form
2. Click "Send Invite"
3. System generates:
   - Unique invite token
   - Secure invite link
   - 7-day expiration
4. Invite appears in "Pending Invites" list

### 4. **Invite List Features**

**Status Badges:**
- 🟢 **Used** - Invite accepted, account created
- 🔵 **Pending** - Awaiting acceptance
- 🔴 **Expired** - Past 7-day expiration

**Actions:**
- **Copy Link** - Click to copy invite URL to clipboard
- Only available for pending, non-expired invites

**Displayed Information:**
- Email address
- Role assigned
- Organization name
- Sent date
- Used date (if applicable)

## API Endpoints

### POST `/api/auth/invite`
Create new invite

**Request Body:**
```json
{
  "email": "user@example.com",
  "role": "entity",
  
  // Option 1: Existing org
  "orgId": "org-entity-001",
  
  // Option 2: New org
  "organizationName": "Ministry of Health",
  "organizationType": "entity"
}
```

**Response:**
```json
{
  "success": true,
  "invite": {
    "id": "invite-123",
    "email": "user@example.com",
    "role": "entity",
    "orgId": "org-entity-001",
    "organizationName": "Ministry of Health",
    "inviteLink": "http://localhost:3000/auth/accept-invite?token=abc123",
    "expiresAt": "2025-01-20T12:00:00Z"
  }
}
```

### GET `/api/auth/invite`
List all invites (admin only)

**Response:**
```json
{
  "invites": [
    {
      "id": "invite-123",
      "email": "user@example.com",
      "role": "entity",
      "orgId": "org-entity-001",
      "token": "abc123",
      "isUsed": false,
      "expiresAt": "2025-01-20T12:00:00Z",
      "createdAt": "2025-01-13T12:00:00Z"
    }
  ]
}
```

### GET `/api/organizations`
List all organizations (admin only)

**Response:**
```json
{
  "organizations": [
    {
      "id": "org-entity-001",
      "name": "Ministry of Infrastructure",
      "type": "entity",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

## User Invitation Flow

### For Admin:
1. Go to Admin Dashboard
2. Click "Invite Users"
3. Fill out invite form
4. Send invite
5. Copy invite link and send to user via email

### For Invited User:
1. Receive invite link
2. Click link → Opens `/auth/accept-invite?token=...`
3. Fill in:
   - Full Name
   - Password
4. Click "Accept Invite"
5. Account created
6. Redirected to login
7. Login and access dashboard

## Permissions

### Who Can Invite:
- ✅ **Admin** - Can invite anyone, create organizations
- ✅ **Entity Users** - Can invite to their own organization only
- ❌ **Provider Users** - Cannot send invites

### Role Assignment Rules:
- Only **Admin** can assign the "Admin" role
- **Entity** users can only assign "Entity" or "Provider" roles
- Role must match organization type (Entity user → Entity org, Provider user → Provider org)

## Security Features

- ✅ **HTTP-only cookies** for sessions
- ✅ **7-day expiration** on invite tokens
- ✅ **One-time use** tokens
- ✅ **Email validation**
- ✅ **Duplicate prevention** (no duplicate emails)
- ✅ **Permission checks** on all operations

## Example Scenarios

### Scenario 1: Inviting to Existing Organization
```
Admin wants to add user to "Ministry of Health"
→ Select "Existing Organization"
→ Choose "Ministry of Health" from dropdown
→ Enter email and select role
→ Send invite
```

### Scenario 2: Creating New Organization + User
```
Admin wants to onboard new ministry
→ Select "Create New Organization"
→ Enter "Ministry of Education"
→ Select type: "Entity"
→ Enter user email and role: "Entity"
→ Send invite
→ New organization created automatically
```

### Scenario 3: Multiple Users, Same Organization
```
Admin invites 3 users to same organization
→ Send 3 separate invites
→ All select same organization from dropdown
→ Each gets unique invite link
→ All join the same organization
```

## Troubleshooting

### Issue: "User already exists"
**Cause**: Email is already registered  
**Solution**: User can login with existing credentials or use different email

### Issue: "Organization not found"
**Cause**: Selected orgId doesn't exist  
**Solution**: Refresh page to reload organizations, or create new organization

### Issue: "Cannot assign provider role to entity organization"
**Cause**: Role/organization type mismatch  
**Solution**: Ensure role matches org type (Entity→Entity, Provider→Provider)

### Issue: Invite link not working
**Cause**: Token expired (>7 days) or already used  
**Solution**: Send a new invite

## Next Steps

1. **Email Integration** - Connect real email service for automatic sending
2. **Bulk Invites** - CSV upload for multiple invites
3. **Custom Expiration** - Allow admin to set custom expiry
4. **Resend Invites** - Button to resend expired invites
5. **Organization Management** - Full CRUD for organizations

---

**Access the Invite Management:**
- **URL**: `http://localhost:3000/admin/invites`
- **Navigation**: Admin Dashboard → "Invite Users" button
- **Required Role**: Admin

**Your Credentials:**
- Email: `founder@verdex.systems`
- Password: `demo123`
