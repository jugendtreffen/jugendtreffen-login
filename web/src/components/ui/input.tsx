import * as React from 'react'

import { cn } from 'src/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'dark:flex dark:h-9 dark:w-full dark:rounded-md dark:border dark:border-input dark:bg-transparent dark:px-3 dark:py-1 dark:text-base dark:shadow-sm dark:transition-colors dark:file:border-0 dark:file:bg-transparent dark:file:text-sm dark:file:font-medium dark:file:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:outline-none dark:focus-visible:ring-1 dark:focus-visible:ring-ring dark:disabled:cursor-not-allowed dark:disabled:opacity-50 dark:md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
