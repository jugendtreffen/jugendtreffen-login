import * as React from 'react'

import { cn } from 'src/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'dark:flex dark:min-h-[60px] dark:w-full dark:rounded-md dark:border dark:border-input dark:bg-transparent dark:px-3 dark:py-2 dark:text-base dark:shadow-sm dark:placeholder:text-muted-foreground dark:focus-visible:outline-none dark:focus-visible:ring-1 dark:focus-visible:ring-ring dark:disabled:cursor-not-allowed dark:disabled:opacity-50 dark:md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
