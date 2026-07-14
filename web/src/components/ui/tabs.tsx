import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "src/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "dark:inline-flex dark:h-9 dark:items-center dark:justify-center dark:rounded-lg dark:bg-muted dark:p-1 dark:text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "dark:inline-flex dark:items-center dark:justify-center dark:whitespace-nowrap dark:rounded-md dark:px-3 dark:py-1 dark:text-sm dark:font-medium dark:ring-offset-background dark:transition-all dark:focus-visible:outline-none dark:focus-visible:ring-2 dark:focus-visible:ring-ring dark:focus-visible:ring-offset-2 dark:disabled:pointer-events-none dark:disabled:opacity-50 dark:data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "dark:mt-2 dark:ring-offset-background dark:focus-visible:outline-none dark:focus-visible:ring-2 dark:focus-visible:ring-ring dark:focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
