#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const canisterIdsPath = path.join(__dirname, '../ic/.dfx/local/canister_ids.json');
const envPath = path.join(__dirname, '../MVP 6/Project Setup/.env.local');
const envTemplatePath = path.join(__dirname, '../MVP 6/Project Setup/env.template');

function updateEnvFile() {
  try {
    // Check if canister_ids.json exists
    if (!fs.existsSync(canisterIdsPath)) {
      console.log('❌ Canister IDs file not found. Please run "dfx deploy" first.');
      return;
    }

    // Read canister IDs
    const canisterIds = JSON.parse(fs.readFileSync(canisterIdsPath, 'utf8'));
    
    // Create .env.local from template if it doesn't exist
    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envTemplatePath)) {
        fs.copyFileSync(envTemplatePath, envPath);
        console.log('📝 Created .env.local from template');
      } else {
        console.log('❌ Template file not found');
        return;
      }
    }

    // Read current .env.local
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update canister IDs
    if (canisterIds.core && canisterIds.core.local) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CORE_CANISTER_ID=.*/,
        `NEXT_PUBLIC_CORE_CANISTER_ID=${canisterIds.core.local}`
      );
    }

    if (canisterIds['escrow-adapter'] && canisterIds['escrow-adapter'].local) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID=.*/,
        `NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID=${canisterIds['escrow-adapter'].local}`
      );
    }

    if (canisterIds.audit && canisterIds.audit.local) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_AUDIT_CANISTER_ID=.*/,
        `NEXT_PUBLIC_AUDIT_CANISTER_ID=${canisterIds.audit.local}`
      );
    }

    // Write updated .env.local
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Updated .env.local with canister IDs:');
    console.log(`   Core: ${canisterIds.core?.local || 'Not found'}`);
    console.log(`   Escrow Adapter: ${canisterIds['escrow-adapter']?.local || 'Not found'}`);
    console.log(`   Audit: ${canisterIds.audit?.local || 'Not found'}`);

  } catch (error) {
    console.error('❌ Error updating environment file:', error.message);
  }
}

updateEnvFile();
