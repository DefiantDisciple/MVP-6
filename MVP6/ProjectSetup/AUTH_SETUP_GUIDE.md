# Authentication & Authorization Setup Guide

## Overview

This guide documents the production-ready multi-tenant authentication system with role-based access control (RBAC) for VerDEX Systems.

## Features

✅ **Multi-tenant Architecture** - Organizations are fully isolated  
✅ **Dual Authentication** - Classic (email/password) OR Internet Identity  
✅ **Role-based Access Control** - Granular permissions per role  
✅ **Invite-only Registration** - Secure onboarding via email invites  
✅ **Email Delivery** - Powered by Resend API  
✅ **Audit Logging** - Security events tracked automatically  
✅ **Session Management** - HTTP-only secure cookies  

## Role Structure

### Platform Administrator
- **ADMIN** - Founder/platform owner only
  - Full system access
  - Can invite any role to any organization
  - Can create new organizations
  - Cannot be assigned by other users

### Entity (Buyer) Roles
- **ENTITY_ADMIN** - Organization administrator
  - Can invite ENTITY_USER to their organization
  - Full tender management
  - Evaluation and awards
  
- **ENTITY_USER** - Standard entity user
  - View-only access to tenders
  - Limited permissions

### Provider (Supplier) Roles
- **PROVIDER_ADMIN** - Organization administrator
  - Can invite PROVIDER_USER to their organization
  - Bid management
  - Team management

- **PROVIDER_USER** - Standard provider user
  - Submit bids
  - View own submissions

## Environment Variables

Add these to your `.env.local` file:

```bash
# Authentication Mode
NEXT_PUBLIC_ENABLE_AUTH=true  # Set to false for demo mode only

# Preview Mode
NEXT_PUBLIC_PREVIEW_MODE=false

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update for production

# IC Network Configuration
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943  # Local development
# NEXT_PUBLIC_IC_HOST=https://ic0.app  # Production

# Canister IDs
NEXT_PUBLIC_CORE_CANISTER_ID=your-core-canister-id
NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID=your-escrow-canister-id
NEXT_PUBLIC_AUDIT_CANISTER_ID=your-audit-canister-id
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=rdmx6-jaaaa-aaaaa-aaadq-cai

# Founder Bootstrap (ADMIN user)
FOUNDER_EMAIL=founder@verdex.systems
FOUNDER_PASSWORD=your-secure-password-here

# Resend API Configuration (REQUIRED for email invites)
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=VerDEX Systems <invites@yourdomain.com>
```

## Resend Email Setup

1. **Sign up for Resend**
   - Visit https://resend.com and create an account
   - Free tier includes 3,000 emails/month

2. **Generate API Key**
   - Go to API Keys in Resend dashboard
   - Create new API key
   - Copy to `RESEND_API_KEY` in `.env.local`

3. **Verify Domain (Production)**
   - Add your domain in Resend dashboard
   - Add DNS records (SPF, DKIM, DMARC)
   - Verify domain ownership
   - Update `RESEND_FROM_EMAIL` with your domain

4. **Development Testing**
   - For local testing, you can use Resend's default sending domain
   - Emails will be marked as "via resend.dev"
   - Production should use verified custom domain

## Founder Bootstrap

The founder ADMIN account is automatically created on first run:

- **Email**: From `FOUNDER_EMAIL` env var (default: `founder@verdex.systems`)
- **Password**: From `FOUNDER_PASSWORD` env var (default: `demo123`)
- **Role**: ADMIN (only user with this role)
- **Auth Methods**: Both classic and Internet Identity

### Linking Internet Identity to Founder Account

1. Log in as founder with email/password
2. Navigate to profile settings
3. Click "Link Internet Identity"
4. Complete II authentication flow
5. Now can log in with either method

## Invite Flow

### 1. Create Invitation

**Admin inviting to new organization:**
```bash
POST /api/invites/create
{
  "email": "user@example.com",
  "role": "ENTITY_ADMIN",
  "orgName": "Department of Health",
  "orgType": "entity"
}
```

**Admin inviting to existing organization:**
```bash
POST /api/invites/create
{
  "email": "user@example.com",
  "role": "ENTITY_USER",
  "orgId": "org-12345"
}
```

**Org Admin inviting team member:**
```bash
POST /api/invites/create
{
  "email": "teammate@example.com",
  "role": "ENTITY_USER",
  "orgId": "<their-org-id>"  # Automatically enforced to their org
}
```

### 2. Email Delivery

- Invitation email sent via Resend
- Contains accept link with secure token
- Expires in 48 hours
- Email template includes:
  - Organization name
  - Role being assigned
  - Accept button/link
  - Expiry warning

### 3. Accept Invitation

User clicks link → `/auth/accept-invite?token=xxx`

**Choose authentication method:**

**Option A: Classic (Email/Password)**
- Enter full name
- Create password (min 8 characters)
- Click "Create Account"

**Option B: Internet Identity**
- Enter full name
- Click "Create Account with Internet Identity"
- Complete II authentication
- Account linked automatically

### 4. Post-Acceptance

- User account created
- Session established
- Audit log created
- Redirected to role-based dashboard

## Permission System

### Invite Permissions

| Inviter Role | Can Invite | To Organization |
|--------------|------------|-----------------|
| ADMIN | Any role | Any org (or create new) |
| ENTITY_ADMIN | ENTITY_USER only | Own org only |
| PROVIDER_ADMIN | PROVIDER_USER only | Own org only |
| ENTITY_USER | None | N/A |
| PROVIDER_USER | None | N/A |

### Route Permissions

| Route | ADMIN | ENTITY_ADMIN | ENTITY_USER | PROVIDER_ADMIN | PROVIDER_USER |
|-------|-------|--------------|-------------|----------------|---------------|
| `/admin/*` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/entity/*` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/provider/*` | ✅ | ❌ | ❌ | ✅ | ✅ |
| `/demo/*` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/landing` | ✅ | ✅ | ✅ | ✅ | ✅ |

## Security Features

### Session Management
- HTTP-only cookies (XSS protection)
- Secure flag in production
- SameSite=lax (CSRF mitigation)
- 7-day expiration
- Server-side validation on every request

### Password Security
- Min 8 characters required
- SHA-256 hashing (upgrade to bcrypt for production)
- Never exposed to client
- Stored separately from other user data

### Audit Logging
Automatically logged events:
- `login_success` - Successful authentication
- `login_failure` - Failed login attempt
- `invite_created` - New invitation sent
- `invite_accepted` - User accepted invite
- `role_changed` - User role modified (admin only)
- `user_deactivated` - Account disabled
- `user_activated` - Account re-enabled

### Tenancy Enforcement
- All database queries filtered by orgId
- Middleware validates org access
- Admin can bypass for platform management
- No cross-org data leakage

## API Endpoints

### Authentication
- `POST /api/auth/login` - Classic email/password login
- `POST /api/auth/ii-login` - Internet Identity login
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user

### Invitations
- `POST /api/invites/create` - Create and send invite
- `GET /api/auth/accept-invite?token=xxx` - Verify invite
- `POST /api/auth/accept-invite` - Accept invite and create account

### Internet Identity
- `POST /api/auth/link-ii` - Link II to existing account

## Testing the System

### 1. Login as Founder
```bash
Email: founder@verdex.systems
Password: demo123 (or your FOUNDER_PASSWORD)
```

### 2. Create Organization & Invite User
- Navigate to `/admin/invites`
- Fill invite form:
  - Email: `test@entity.com`
  - Role: `ENTITY_ADMIN`
  - Organization: Create new "Test Ministry"
  - Type: Entity
- Click "Send Invite"

### 3. Accept Invitation
- Check invite email
- Click accept link
- Choose auth method (password or II)
- Complete registration
- Verify redirect to correct dashboard

### 4. Test Permissions
- Log out
- Log in as new user
- Verify can only access entity routes
- Try to access `/admin/*` → should redirect
- Try to access `/provider/*` → should redirect

### 5. Test Multi-Tenancy
- Create second entity organization
- Invite user to second org
- Verify users can only see their own org data

## Demo Mode

For demonstrations without auth enforcement:

```bash
NEXT_PUBLIC_ENABLE_AUTH=false
```

- All routes accessible
- Demo dashboards available at `/demo/entity` and `/demo/provider`
- No login required
- Useful for UI/UX presentations

## Production Checklist

- [ ] Set `NEXT_PUBLIC_ENABLE_AUTH=true`
- [ ] Configure verified Resend domain
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Set strong `FOUNDER_PASSWORD`
- [ ] Deploy canisters to IC mainnet
- [ ] Update canister IDs in environment
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set `NODE_ENV=production`
- [ ] Upgrade to bcrypt for password hashing
- [ ] Implement rate limiting on auth endpoints
- [ ] Set up monitoring for failed login attempts
- [ ] Configure backup/restore for user data
- [ ] Review and update CORS settings
- [ ] Test email deliverability
- [ ] Document incident response procedures

## Troubleshooting

### Emails not sending
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for errors
- Ensure `RESEND_FROM_EMAIL` uses verified domain (production)
- Review Resend API logs

### Can't log in as founder
- Check `FOUNDER_EMAIL` matches exactly
- Verify `FOUNDER_PASSWORD` is correct
- Look for user in store initialization logs
- Try resetting by clearing store (dev only)

### Users redirected after login
- Verify role is set correctly in database
- Check middleware role mappings
- Ensure session cookies are being set
- Review browser console for errors

### II login fails
- Verify `NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID` is correct
- Check IC network is running (local dev)
- Ensure II canister is deployed
- Review II principal format

### Invites expire immediately
- Check server time is correct
- Verify token expiry logic (48 hours default)
- Review invite creation logs

## Support

For issues or questions:
- Review this guide thoroughly
- Check audit logs for security events
- Review browser console and server logs
- Verify environment variables are set correctly

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready
