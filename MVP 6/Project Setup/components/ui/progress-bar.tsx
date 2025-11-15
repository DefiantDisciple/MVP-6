"use client"

import type * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  showLabel?: boolean
  label?: string
}

export function ProgressBar({ className, value = 0, showLabel = false, label, ...props }: ProgressBarProps) {
  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label || "Progress"}</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
}
