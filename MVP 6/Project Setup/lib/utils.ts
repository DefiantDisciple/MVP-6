import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency with Botswana Pula symbol
 */
export function formatCurrency(amount: number, currency = "BWP"): string {
  if (currency === "BWP" || currency === "P") {
    return `P ${amount.toLocaleString("en-BW", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return new Intl.NumberFormat("en-BW", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

/**
 * Format date as DD MMM YYYY (e.g., 15 Jan 2024)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date

  const day = d.getDate().toString().padStart(2, "0")
  const month = d.toLocaleString("en-US", { month: "short" })
  const year = d.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date

  const dateStr = formatDate(d)
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return `${dateStr} at ${time}`
}

/**
 * Mock file hash generator (SHA-256 simulation)
 * In production, this should use actual crypto.subtle.digest
 */
export async function hashFileMock(file: File): Promise<string> {
  // Simulate hashing with file metadata
  const content = `${file.name}-${file.size}-${file.lastModified}`

  // Simple hash simulation (NOT cryptographically secure)
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Convert to hex and pad with random chars to simulate SHA-256
  const baseHash = Math.abs(hash).toString(16).padStart(8, "0")
  const randomSuffix = Math.random().toString(16).substring(2, 10)

  return `${baseHash}${randomSuffix}${randomSuffix}${randomSuffix}${randomSuffix}${randomSuffix}${randomSuffix}`
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

/**
 * Generate receipt number
 */
export function generateReceiptNumber(prefix = "RCP"): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${timestamp}-${random}`
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
