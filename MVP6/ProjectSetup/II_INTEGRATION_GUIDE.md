# Internet Identity Integration Guide

## Overview

Internet Identity (II) login has been added to the VerDEX platform, allowing users to authenticate using their Internet Computer identity instead of traditional email/password.

## Features Implemented

### 1. **Login with Internet Identity**
- ✅ II login button on the Login tab
- ✅ Seamless authentication flow
- ✅ Links to existing user accounts via II principal
- ✅ Falls back gracefully if no account is linked

### 2. **Account Linking**
- ✅ Users can link their II to existing accounts
- ✅ API endpoint: `POST /api/auth/link-ii`
- ✅ Prevents duplicate principal linking
- ✅ Enables dual authentication (Classic + II)

### 3. **Dual Authentication Support**
- ✅ Users with `authMethod: "both"` can use either method
- ✅ Founder admin supports both by default
- ✅ Secure session management for both auth methods

## How It Works

### User Flow

1. **First-time User (Invited with Classic Auth)**
   - User receives invite email
   - Creates account with email/password
   - Can optionally link Internet Identity later

2. **Login with Internet Identity**
   - Click "Sign in with Internet Identity" button
   - II authentication popup opens
   - User authenticates with their II
   - If linked: Logs in automatically
   - If not linked: Shows message to contact admin

3. **Linking II to Account**
   - User logs in with email/password first
   - Calls `/api/auth/link-ii` with their II principal
   - Account is updated to support both auth methods

## Technical Implementation

### Files Created

1. **`/lib/auth/internet-identity.ts`**
   - II authentication utilities
   - Functions: `loginWithII()`, `logoutFromII()`, `getPrincipal()`

2. **`/app/api/auth/ii-login/route.ts`**
   - Handles II authentication
   - Validates principal and creates session

3. **`/app/api/auth/link-ii/route.ts`**
   - Links II principal to existing user account
   - Prevents duplicate linking

### Updated Files

1. **`/app/login/page.tsx`**
   - Added II login button with Fingerprint icon
   - Added `handleIILogin()` function
   - Divider between classic and II login

2. **`/lib/db/store.ts`**
   - Added `findByIIPrincipal()` method
   - Added `update()` method for user updates
   - Added `iiPrincipal` field to founder admin

3. **`/middleware.ts`**
   - Added II routes to public routes list

4. **`/package.json`**
   - Installed `@dfinity/auth-client@latest`
   - Installed `@dfinity/agent@latest`
   - Installed `@dfinity/principal@latest`

## Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Internet Computer Configuration
NEXT_PUBLIC_IC_HOST=https://ic0.app

# For local testing, you can use:
# NEXT_PUBLIC_IC_HOST=http://localhost:4943
```

## Testing

### Test II Login (Production)

1. Navigate to `/login`
2. Click "Sign in with Internet Identity"
3. Authenticate with your II
4. If you have an account linked: You'll be logged in
5. If not: You'll see a message to contact admin

### Test Account Linking

To link your II to an existing account:

```bash
# 1. Login with classic auth first
# 2. Get your II principal from the II login attempt
# 3. Call the link API:

curl -X POST http://localhost:3000/api/auth/link-ii \
  -H "Content-Type: application/json" \
  -H "Cookie: user_id=YOUR_USER_ID; user_role=YOUR_ROLE" \
  -d '{
    "principal": "YOUR_II_PRINCIPAL"
  }'
```

### Demo Account Support

The founder admin (`founder@verdex.systems`) has `authMethod: "both"` by default, but the II principal is not yet linked. To use II with the founder account:

1. Login with `founder@verdex.systems` / `demo123`
2. Use the link-ii endpoint to connect your II
3. Logout and login again with II

## Security Considerations

### Current Implementation
- ✅ II principals are unique identifiers
- ✅ Session cookies set securely (httpOnly, sameSite)
- ✅ Principal validation on backend
- ✅ Prevents duplicate principal linking

### Production Recommendations
- ✅ Use production IC network (`https://ic0.app`)
- ✅ Implement principal-based rate limiting
- ✅ Add audit logging for II logins
- ✅ Store II principals in encrypted database
- ⚠️ Consider adding email verification after II signup

## User Management

### Inviting Users with II Support

When inviting a new user, you can:

**Option 1: Invite for Classic Auth**
- User creates account with email/password
- User can optionally link II later

**Option 2: Invite for II Only** (Future Feature)
- Admin creates invite with II principal
- User signs up directly with II
- No password needed

## Troubleshooting

### "No account linked to this Internet Identity"

**Cause**: The II principal is not associated with any user account.

**Solution**:
1. Login with classic auth (email/password)
2. Link your II using the link-ii API
3. Try II login again

### II popup doesn't open

**Cause**: Browser popup blocker or incorrect IC host.

**Solution**:
1. Allow popups for localhost/your domain
2. Check `NEXT_PUBLIC_IC_HOST` is set correctly
3. Verify internet connection

### "This Internet Identity is already linked"

**Cause**: The II principal is already associated with another account.

**Solution**:
- Each II can only be linked to one account
- Contact admin if you need to transfer II to a different account

## API Reference

### POST /api/auth/ii-login

Authenticates user with Internet Identity principal.

**Request:**
```json
{
  "principal": "2vxsx-fae"
}
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-001",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "entity",
    "orgId": "org-123",
    "organizationName": "Ministry of Infrastructure",
    "authMethod": "both"
  }
}
```

**Error Response:**
```json
{
  "error": "No account linked to this Internet Identity",
  "needsLinking": true,
  "principal": "2vxsx-fae"
}
```

### POST /api/auth/link-ii

Links Internet Identity to current user account (requires authentication).

**Request:**
```json
{
  "principal": "2vxsx-fae"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Internet Identity linked successfully",
  "user": {
    "id": "user-001",
    "email": "user@example.com",
    "name": "John Doe",
    "authMethod": "both"
  }
}
```

## Next Steps

1. **Test II Login**: Try logging in with Internet Identity
2. **Link Accounts**: Link existing accounts to II principals
3. **Update Invite Flow**: Add option to invite users for II-only auth
4. **Add Profile Page**: Allow users to manage linked auth methods
5. **Implement II-based Invites**: Skip email/password for II users

## Support

For issues or questions about Internet Identity integration:
- Check the [Internet Identity documentation](https://internetcomputer.org/docs/current/developer-docs/integrations/internet-identity/)
- Review the DFINITY auth-client [GitHub repo](https://github.com/dfinity/agent-js)
- Contact the development team

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Ready for testing
