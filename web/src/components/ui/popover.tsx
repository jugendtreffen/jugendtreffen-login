import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

import { cn } from 'src/lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'dark:z-50 dark:w-72 dark:rounded-md dark:border dark:bg-popover dark:p-4 dark:text-popover-foreground dark:shadow-md dark:outline-none dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=open]:fade-in-0 dark:data-[state=closed]:zoom-out-95 dark:data-[state=open]:zoom-in-95 dark:data-[side=bottom]:slide-in-from-top-2 dark:data-[side=left]:slide-in-from-right-2 dark:data-[side=right]:slide-in-from-left-2 dark:data-[side=top]:slide-in-from-bottom-2 dark:origin-[--radix-popover-content-transform-origin]',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
