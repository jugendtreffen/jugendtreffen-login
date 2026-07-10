import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "src/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "dark:z-50 dark:overflow-hidden dark:rounded-md dark:bg-primary dark:px-3 dark:py-1.5 dark:text-xs dark:text-primary-foreground dark:animate-in dark:fade-in-0 dark:zoom-in-95 dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=closed]:zoom-out-95 dark:data-[side=bottom]:slide-in-from-top-2 dark:data-[side=left]:slide-in-from-right-2 dark:data-[side=right]:slide-in-from-left-2 dark:data-[side=top]:slide-in-from-bottom-2 dark:origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
