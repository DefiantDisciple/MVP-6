// Utility functions for date formatting and business day calculations

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatCurrency(amount: number): string {
  return `P ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function isBusinessDay(date: Date): boolean {
  const day = date.getDay()
  return day !== 0 && day !== 6 // Not Sunday (0) or Saturday (6)
}

export function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate)
  let remaining = days

  while (remaining > 0) {
    result.setDate(result.getDate() + 1)
    if (isBusinessDay(result)) {
      remaining--
    }
  }

  return result
}

export function getBusinessDaysRemaining(targetDate: Date): number {
  const now = new Date()
  let count = 0
  const current = new Date(now)

  while (current < targetDate) {
    current.setDate(current.getDate() + 1)
    if (isBusinessDay(current)) {
      count++
    }
  }

  return count
}

export function getStandstillEndDate(noticeDate: Date): Date {
  return addBusinessDays(noticeDate, 10)
}
