// Utility functions for formatting dates, currency, and business days

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return `P ${amount.toLocaleString("en-BW", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function businessDaysLeft(startDate: Date | string, totalDays: number): number {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate
  const now = new Date()

  let businessDays = 0
  const current = new Date(start)

  while (current <= now) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      businessDays++
    }
    current.setDate(current.getDate() + 1)
  }

  return Math.max(0, totalDays - businessDays)
}

export function getCountdown(targetDate: Date | string): string {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate
  const now = new Date()
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) return "Closed"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}
