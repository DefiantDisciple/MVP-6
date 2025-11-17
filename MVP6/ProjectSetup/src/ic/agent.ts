import { HttpAgent, Actor } from '@dfinity/agent';

// Create anonymous agent for preview mode
export function getAnonymousAgent() {
  const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';
  const agent = new HttpAgent({ host });
  
  // Fetch root key for local development
  if (host.startsWith('http://127.0.0.1')) {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key for local development:', err);
    });
  }
  
  return agent;
}

// Actor factory for creating canister actors
export function actorFactory(canisterId: string, idlFactory: any) {
  const agent = getAnonymousAgent();
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}

// Canister IDs from environment
export const CANISTER_IDS = {
  core: process.env.NEXT_PUBLIC_CORE_CANISTER_ID || '',
  escrowAdapter: process.env.NEXT_PUBLIC_ESCROW_ADAPTER_CANISTER_ID || '',
  audit: process.env.NEXT_PUBLIC_AUDIT_CANISTER_ID || '',
};

// Preview mode flag
export const PREVIEW_MODE = process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';
