#!/bin/bash

# Procuredex IC Deployment Script
# This script deploys the Internet Computer canisters for the escrow adapter

set -e

echo "🚀 Starting Procuredex IC Deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install the DFINITY SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ dfx.json not found. Please run this script from the ic/ directory."
    exit 1
fi

# Start dfx if not running
echo "🔧 Starting local dfx replica..."
dfx start --background --clean

# Wait for replica to be ready
echo "⏳ Waiting for replica to be ready..."
sleep 5

# Deploy canisters
echo "📦 Deploying canisters..."

# Deploy core canister
echo "🔹 Deploying core canister..."
dfx deploy core

# Deploy escrow-adapter canister
echo "🔹 Deploying escrow-adapter canister..."
dfx deploy escrow-adapter

# Deploy audit canister
echo "🔹 Deploying audit canister..."
dfx deploy audit

# Get canister IDs
echo "📋 Getting canister IDs..."
CORE_CANISTER_ID=$(dfx canister id core)
ESCROW_ADAPTER_CANISTER_ID=$(dfx canister id escrow-adapter)
AUDIT_CANISTER_ID=$(dfx canister id audit)

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Canister Information:"
echo "Core Canister ID: $CORE_CANISTER_ID"
echo "Escrow Adapter Canister ID: $ESCROW_ADAPTER_CANISTER_ID"
echo "Audit Canister ID: $AUDIT_CANISTER_ID"
echo ""
echo "🔧 Environment Variables for Frontend:"
echo "NEXT_PUBLIC_CORE_CANISTER_ID=$CORE_CANISTER_ID"
echo "NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID=$ESCROW_ADAPTER_CANISTER_ID"
echo "NEXT_PUBLIC_AUDIT_CANISTER_ID=$AUDIT_CANISTER_ID"
echo "NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943"
echo "NEXT_PUBLIC_PREVIEW_MODE=false"
echo ""

# Create .env.local file for the frontend
ENV_FILE="../MVP 6/Project Setup/.env.local"
echo "📝 Creating environment file at $ENV_FILE..."

cat > "$ENV_FILE" << EOF
# Internet Computer Canister IDs
NEXT_PUBLIC_CORE_CANISTER_ID=$CORE_CANISTER_ID
NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID=$ESCROW_ADAPTER_CANISTER_ID
NEXT_PUBLIC_AUDIT_CANISTER_ID=$AUDIT_CANISTER_ID

# IC Network Configuration
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:4943
NEXT_PUBLIC_PREVIEW_MODE=false

# Development Settings
NODE_ENV=development
EOF

echo "✅ Environment file created successfully!"
echo ""
echo "🧪 Testing escrow adapter..."

# Test the escrow adapter
echo "🔹 Testing create_escrow function..."
dfx canister call escrow-adapter create_escrow '(1, 100000, "BWP")'

echo "🔹 Testing get_escrow_stats function..."
dfx canister call escrow-adapter get_escrow_stats

echo ""
echo "🎉 All tests passed! The escrow adapter is ready to use."
echo ""
echo "📚 Next Steps:"
echo "1. Start your Next.js frontend: cd '../MVP 6/Project Setup' && npm run dev"
echo "2. The frontend will automatically connect to the local IC replica"
echo "3. Test escrow operations through the admin dashboard"
echo ""
echo "🛑 To stop the IC replica: dfx stop"
echo "🔄 To redeploy: ./deploy.sh"
