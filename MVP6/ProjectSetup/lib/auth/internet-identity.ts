/**
 * Internet Identity Authentication Integration
 * Client-side only - do not import on server
 */

// @ts-ignore - Client-side only imports
import { AuthClient } from "@dfinity/auth-client"
// @ts-ignore
import type { Identity } from "@dfinity/agent"

let authClient: AuthClient | null = null

/**
 * Initialize the auth client
 */
export async function initAuthClient(): Promise<AuthClient> {
    if (!authClient) {
        authClient = await AuthClient.create()
    }
    return authClient
}

/**
 * Get the current authenticated identity
 */
export async function getIdentity(): Promise<Identity | null> {
    const client = await initAuthClient()
    const isAuthenticated = await client.isAuthenticated()

    if (isAuthenticated) {
        return client.getIdentity()
    }

    return null
}

/**
 * Get the principal (user ID) from Internet Identity
 */
export async function getPrincipal(): Promise<string | null> {
    const identity = await getIdentity()

    if (identity) {
        return identity.getPrincipal().toString()
    }

    return null
}

/**
 * Login with Internet Identity
 */
export async function loginWithII(): Promise<string | null> {
    const client = await initAuthClient()

    // Get IC host and II canister ID from environment
    const icHost = process.env.NEXT_PUBLIC_IC_HOST || "https://ic0.app"
    const iiCanisterId = process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "rdmx6-jaaaa-aaaaa-aaadq-cai"

    // For local development, use the query parameter format
    const isLocal = icHost.includes("localhost") || icHost.includes("127.0.0.1")
    const identityProvider = isLocal
        ? `http://127.0.0.1:4943?canisterId=${iiCanisterId}`
        : `https://identity.ic0.app`

    return new Promise((resolve, reject) => {
        client.login({
            identityProvider,
            onSuccess: async () => {
                const principal = await getPrincipal()
                resolve(principal)
            },
            onError: (error) => {
                console.error("II Login error:", error)
                reject(error)
            },
            // Optional: Set max time to live for the session (7 days)
            maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        })
    })
}

/**
 * Logout from Internet Identity
 */
export async function logoutFromII(): Promise<void> {
    const client = await initAuthClient()
    await client.logout()
}

/**
 * Check if user is authenticated with II
 */
export async function isAuthenticated(): Promise<boolean> {
    const client = await initAuthClient()
    return await client.isAuthenticated()
}
