# TenderHub - ICP Procurement Platform

A complete procurement platform built on the Internet Computer Protocol (ICP) with a Next.js frontend. Features **Preview Mode** for testing all functionality without authentication.

## 🚀 Quick Start (1-Hour Bring-up)

### Prerequisites
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed
- Node.js 18+ and npm
- Git

### 1. Deploy ICP Backend

```bash
# Navigate to IC backend
cd ic

# Start local IC replica
dfx start --clean --background

# Deploy all canisters
dfx deploy audit
dfx deploy escrow-adapter  
dfx deploy core

# Generate declarations
dfx generate
```

### 2. Configure Frontend Environment

```bash
# Copy environment template
cp "MVP 6/Project Setup/env.template" "MVP 6/Project Setup/.env.local"

# Auto-update canister IDs from deployment
node scripts/update-env.js
```

### 3. Start Frontend

```bash
# Navigate to frontend
cd "MVP 6/Project Setup"

# Install dependencies (already done)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

### 4. Access Preview Mode

Visit **http://localhost:3000** and click through:
- **Buyers Dashboard** - Manage tenders and review bids
- **Vendors Dashboard** - Browse tenders with tabbed interface  
- **Admin Console** - System overview and audit logs

## 📁 Project Structure

```
/
├── ic/                          # ICP Backend
│   ├── dfx.json                # DFX configuration
│   ├── core/                   # Core tender management
│   │   ├── main.mo            # Motoko implementation
│   │   └── core.did           # Candid interface
│   ├── escrow-adapter/         # Escrow integration
│   │   ├── main.mo
│   │   └── escrow_adapter.did
│   └── audit/                  # Audit logging
│       ├── main.mo
│       └── audit.did
├── MVP 6/Project Setup/        # Next.js Frontend
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Landing with 3 buttons
│   │   ├── buyer/page.tsx     # Buyers dashboard
│   │   ├── vendor/page.tsx    # Vendors dashboard (tabbed)
│   │   └── admin/page.tsx     # Admin console
│   ├── src/
│   │   ├── ic/
│   │   │   ├── agent.ts       # ICP agent setup
│   │   │   └── declarations/  # Generated canister interfaces
│   │   └── components/        # React components
│   │       ├── TendersList.tsx
│   │       ├── CreateTender.tsx
│   │       ├── SubmitBid.tsx
│   │       ├── AwardTender.tsx
│   │       └── AuditFeed.tsx
│   └── .env.local             # Environment configuration
└── scripts/
    └── update-env.js          # Auto-update canister IDs
```

## 🎯 Core Features

### Backend Canisters

**Core Canister:**
- `create_tender(title, description, closing_ts)` - Create new tender
- `list_open_tenders()` - Get all open tenders  
- `submit_bid(tender_id, amount, doc_hash)` - Submit bid
- `award_tender(tender_id, winner_bid_id)` - Award contract

**Escrow Adapter:**
- `create_escrow(tender_id, amount, currency)` - Create escrow
- `release_payment(escrow_ref)` - Release payment
- `mirror_event(kind, payload)` - Mirror external events

**Audit Canister:**
- `append_event(source, kind, data)` - Log audit event
- `get_events(limit)` - Retrieve audit trail

### Frontend Pages

**Landing Page (`/`):**
- Three large dashboard buttons
- Preview Mode indicator
- Modern UI with hover effects

**Buyers Dashboard (`/buyer`):**
- List of open tenders
- Submit bid form (Preview)
- Audit feed sidebar

**Vendors Dashboard (`/vendor`):**
- **Tabbed Interface:** Open Tenders, Clarifications, My Submissions, Notice to Award, Awarded, Active, Closed, My Disputes
- Create Tender form (Preview)
- Submit Bid form (Preview)  
- Award Tender form (Preview)
- Live audit feed

**Admin Console (`/admin`):**
- **Stats Snapshot:** Open tenders, submissions, awarded, escrows created
- **Tabbed Interface:** Audit Log, Escrow Mirror, System
- System information with canister IDs
- Network configuration display

## 🔧 Development Commands

### Backend (IC)
```bash
# Start local replica
dfx start --clean --background

# Deploy individual canisters
dfx deploy core
dfx deploy escrow-adapter
dfx deploy audit

# Check canister status
dfx canister status --all

# Stop local replica
dfx stop
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Management
```bash
# Update canister IDs after deployment
node scripts/update-env.js

# Check current environment
cat "MVP 6/Project Setup/.env.local"
```

## 🌐 Deployment

### Local Development
- IC Host: `http://127.0.0.1:4943`
- Frontend: `http://localhost:3000`
- Auto root key fetching enabled

### Production (IC Mainnet)
```bash
# Deploy to IC mainnet
cd ic
dfx deploy --network ic core
dfx deploy --network ic escrow-adapter  
dfx deploy --network ic audit

# Update environment for production
# Set NEXT_PUBLIC_IC_HOST=https://ic0.app
# Update canister IDs with production values
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_PREVIEW_MODE=true
   NEXT_PUBLIC_IC_HOST=https://ic0.app
   NEXT_PUBLIC_CORE_CANISTER_ID=<production-id>
   NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID=<production-id>
   NEXT_PUBLIC_AUDIT_CANISTER_ID=<production-id>
   ```
3. Deploy automatically on push

## 🔍 Preview Mode Features

- **No Authentication Required** - All pages accessible
- **Full Functionality** - All canister methods callable
- **Live Data** - Real canister interactions
- **Visual Indicators** - Preview mode clearly marked
- **Complete Navigation** - All dashboards linked

## 🛠 Troubleshooting

### Common Issues

**"Cannot find module '@dfinity/agent'"**
```bash
cd "MVP 6/Project Setup"
npm install --legacy-peer-deps
```

**"Core canister ID not configured"**
```bash
# Ensure canisters are deployed
dfx deploy --all
# Update environment
node scripts/update-env.js
```

**"Root key error (local)"**
- Ensure `NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943` in `.env.local`
- Agent automatically fetches root key for local development

**CORS/Host Mismatch**
- Local: Use `http://127.0.0.1:4943`
- Production: Use `https://ic0.app`

### Reset Everything
```bash
# Stop and clean IC
dfx stop
dfx start --clean --background

# Redeploy all canisters
dfx deploy --all

# Update environment
node scripts/update-env.js

# Restart frontend
cd "MVP 6/Project Setup"
npm run dev
```

## 📋 Next Steps

1. **Test All Features** - Click through all dashboards and forms
2. **Add Real Data** - Create tenders and submit bids
3. **Customize Styling** - Modify existing components to match brand
4. **Add Authentication** - Integrate Internet Identity when ready
5. **Deploy to Production** - Follow IC mainnet deployment guide

## 🎉 Success Criteria

✅ Landing page with 3 dashboard buttons  
✅ All dashboards accessible without auth  
✅ ICP canisters deployed and connected  
✅ Forms submit to live canisters  
✅ Audit trail working  
✅ Preview mode clearly indicated  
✅ Modern UI with existing styling preserved  

Your procurement platform is now ready for preview and testing!
