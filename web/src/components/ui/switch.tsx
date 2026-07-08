import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "src/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "dark:peer dark:inline-flex dark:h-5 dark:w-9 dark:shrink-0 dark:cursor-pointer dark:items-center dark:rounded-full dark:border-2 dark:border-transparent dark:shadow-sm dark:transition-colors dark:focus-visible:outline-none dark:focus-visible:ring-2 dark:focus-visible:ring-ring dark:focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background dark:disabled:cursor-not-allowed dark:disabled:opacity-50 dark:data-[state=checked]:bg-primary dark:data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "dark:pointer-events-none dark:block dark:h-4 dark:w-4 dark:rounded-full dark:bg-background dark:shadow-lg dark:ring-0 dark:transition-transform dark:data-[state=checked]:translate-x-4 dark:data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
