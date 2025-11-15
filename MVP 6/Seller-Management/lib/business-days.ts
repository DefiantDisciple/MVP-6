/**
 * Calculate business days (Mon-Fri) between two dates
 * Used for standstill period calculations
 */
export function addBusinessDays(startDate: Date, daysToAdd: number): Date {
  const result = new Date(startDate)
  let remainingDays = daysToAdd

  while (remainingDays > 0) {
    result.setDate(result.getDate() + 1)
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      remainingDays--
    }
  }

  return result
}

export function getBusinessDaysRemaining(targetDate: Date): number {
  const now = new Date()
  let businessDays = 0
  const current = new Date(now)

  while (current < targetDate) {
    current.setDate(current.getDate() + 1)
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      businessDays++
    }
  }

  return Math.max(0, businessDays)
}
