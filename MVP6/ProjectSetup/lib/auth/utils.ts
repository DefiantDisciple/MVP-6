/**
 * Authentication utility functions
 */

import crypto from "crypto"

/**
 * Hash a password (placeholder - use bcrypt in production)
 * For now, using simple crypto for demo purposes
 */
export function hashPassword(password: string): string {
    // In production, use bcrypt:
    // return await bcrypt.hash(password, 10)

    // For demo purposes, use crypto
    return crypto.createHash("sha256").update(password).digest("hex")
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
    // In production, use bcrypt:
    // return await bcrypt.compare(password, hash)

    // For demo purposes
    const inputHash = crypto.createHash("sha256").update(password).digest("hex")
    return inputHash === hash
}

/**
 * Generate a secure random invite token
 */
export function generateInviteToken(): string {
    return crypto.randomBytes(32).toString("hex")
}

/**
 * Generate a unique user ID
 */
export function generateUserId(): string {
    return `user-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
}

/**
 * Generate a unique organization ID
 */
export function generateOrgId(): string {
    return `org-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
}

/**
 * Generate a unique invite ID
 */
export function generateInviteId(): string {
    return `invite-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
    // Minimum 8 characters
    return password.length >= 8
}
