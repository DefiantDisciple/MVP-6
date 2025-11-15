"use client"

import * as React from "react"
import { businessDaysLeft } from "@/lib/businessDays"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface CountdownProps {
  deadline: Date
  className?: string
  showIcon?: boolean
}

export function Countdown({ deadline, className, showIcon = true }: CountdownProps) {
  const [daysLeft, setDaysLeft] = React.useState<number>(0)
  const [isExpired, setIsExpired] = React.useState(false)

  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const days = businessDaysLeft(now, deadline)

      setDaysLeft(days)
      setIsExpired(days <= 0)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [deadline])

  const getVariantStyles = () => {
    if (isExpired) return "text-destructive"
    if (daysLeft <= 2) return "text-warning"
    if (daysLeft <= 5) return "text-orange-600"
    return "text-muted-foreground"
  }

  return (
    <div className={cn("flex items-center gap-1.5", getVariantStyles(), className)}>
      {showIcon && <Clock className="h-4 w-4" />}
      <span className="text-sm font-medium">
        {isExpired ? (
          "Expired"
        ) : (
          <>
            {daysLeft} business {daysLeft === 1 ? "day" : "days"} left
          </>
        )}
      </span>
    </div>
  )
}
