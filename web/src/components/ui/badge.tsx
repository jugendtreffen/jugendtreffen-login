import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "src/lib/utils"

const badgeVariants = cva(
  "dark:inline-flex dark:items-center dark:rounded-md dark:border dark:px-2.5 dark:py-0.5 dark:text-xs dark:font-semibold dark:transition-colors dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-ring dark:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "dark:border-transparent dark:bg-primary dark:text-foreground-primary dark:shadow dark:bg-primary/40",
        secondary:
          "dark:border-transparent dark:bg-secondary dark:text-secondary-foreground dark:bg-secondary/60",
        destructive:
          "dark:border-transparent dark:bg-destructive dark:text-destructive dark:shadow dark:bg-destructive/40",
        outline: "dark:text-foreground",
        success: "dark:border-transparent dark:bg-success dark:text-success dark:shadow dark:bg-success/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
