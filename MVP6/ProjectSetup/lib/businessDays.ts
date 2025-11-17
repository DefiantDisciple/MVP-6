/**
 * Business day utilities for tender deadline calculations
 * Mon-Fri only, with optional holiday exclusions
 */

// Default holidays (can be overridden)
const DEFAULT_HOLIDAYS: Date[] = []

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is a holiday
 */
function isHoliday(date: Date, holidays: Date[] = DEFAULT_HOLIDAYS): boolean {
  const dateStr = date.toISOString().split("T")[0]
  return holidays.some((holiday) => {
    const holidayStr = holiday.toISOString().split("T")[0]
    return dateStr === holidayStr
  })
}

/**
 * Check if a date is a business day
 */
export function isBusinessDay(date: Date, holidays: Date[] = DEFAULT_HOLIDAYS): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays)
}

/**
 * Add business days to a date
 * Skips weekends and holidays
 */
export function addBusinessDays(startDate: Date, daysToAdd: number, holidays: Date[] = DEFAULT_HOLIDAYS): Date {
  if (daysToAdd === 0) return startDate

  const result = new Date(startDate)
  let remainingDays = Math.abs(daysToAdd)
  const direction = daysToAdd > 0 ? 1 : -1

  while (remainingDays > 0) {
    result.setDate(result.getDate() + direction)

    if (isBusinessDay(result, holidays)) {
      remainingDays--
    }
  }

  return result
}

/**
 * Calculate business days remaining between two dates
 * Returns negative if end date is before start date
 */
export function businessDaysLeft(startDate: Date, endDate: Date, holidays: Date[] = DEFAULT_HOLIDAYS): number {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Set to start of day for accurate comparison
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  if (start.getTime() === end.getTime()) return 0

  const direction = end > start ? 1 : -1
  const current = new Date(start)
  let businessDays = 0

  while (current.getTime() !== end.getTime()) {
    current.setDate(current.getDate() + direction)

    if (isBusinessDay(current, holidays)) {
      businessDays++
    }

    // Safety check to prevent infinite loop
    if (Math.abs(businessDays) > 10000) {
      throw new Error("Business days calculation exceeded safety limit")
    }
  }

  return direction * businessDays
}

/**
 * Get the next business day from a given date
 */
export function getNextBusinessDay(date: Date, holidays: Date[] = DEFAULT_HOLIDAYS): Date {
  return addBusinessDays(date, 1, holidays)
}

/**
 * Get the previous business day from a given date
 */
export function getPreviousBusinessDay(date: Date, holidays: Date[] = DEFAULT_HOLIDAYS): Date {
  return addBusinessDays(date, -1, holidays)
}

/**
 * Check if current time is past a deadline
 */
export function isPastDeadline(deadline: Date): boolean {
  return new Date() > deadline
}

/**
 * Get business days between two dates (inclusive of start, exclusive of end)
 */
export function countBusinessDays(startDate: Date, endDate: Date, holidays: Date[] = DEFAULT_HOLIDAYS): number {
  return Math.abs(businessDaysLeft(startDate, endDate, holidays))
}
