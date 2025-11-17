import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { TenderStage } from "@/lib/types"

const statusPillVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        published: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        clarification: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        submission: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
        evaluation: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        awarded: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        disputed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  },
)

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {
  status?: TenderStage | string
}

export function StatusPill({ className, variant, status, children, ...props }: StatusPillProps) {
  const variantToUse = (variant || status) as any

  return (
    <span className={cn(statusPillVariants({ variant: variantToUse }), className)} {...props}>
      {children || status?.replace(/_/g, " ").toUpperCase()}
    </span>
  )
}
