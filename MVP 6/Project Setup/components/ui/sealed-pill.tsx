import { cn } from "@/lib/utils"
import { Lock, LockOpen } from "lucide-react"

interface SealedPillProps {
  isSealed: boolean
  className?: string
}

export function SealedPill({ isSealed, className }: SealedPillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        isSealed
          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        className,
      )}
    >
      {isSealed ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
      <span>{isSealed ? "Sealed" : "Open"}</span>
    </div>
  )
}
