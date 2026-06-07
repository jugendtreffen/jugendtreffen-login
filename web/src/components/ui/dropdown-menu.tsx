"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "src/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "dark:flex dark:cursor-default dark:select-none dark:items-center dark:gap-2 dark:rounded-sm dark:px-2 dark:py-1.5 dark:text-sm dark:outline-none dark:focus:bg-accent dark:data-[state=open]:bg-accent dark:[&_svg]:pointer-events-none dark:[&_svg]:size-4 dark:[&_svg]:shrink-0",
      inset && "dark:pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="dark:ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "dark:z-50 dark:min-w-[8rem] dark:overflow-hidden dark:rounded-md dark:border dark:bg-popover dark:p-1 dark:text-popover-foreground dark:shadow-lg dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=open]:fade-in-0 dark:data-[state=closed]:zoom-out-95 dark:data-[state=open]:zoom-in-95 dark:data-[side=bottom]:slide-in-from-top-2 dark:data-[side=left]:slide-in-from-right-2 dark:data-[side=right]:slide-in-from-left-2 dark:data-[side=top]:slide-in-from-bottom-2 dark:origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "dark:z-50 dark:max-h-[var(--radix-dropdown-menu-content-available-height)] dark:min-w-[8rem] dark:overflow-y-auto dark:overflow-x-hidden dark:rounded-md dark:border dark:bg-popover dark:p-1 dark:text-popover-foreground dark:shadow-md",
        "dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=open]:fade-in-0 dark:data-[state=closed]:zoom-out-95 dark:data-[state=open]:zoom-in-95 dark:data-[side=bottom]:slide-in-from-top-2 dark:data-[side=left]:slide-in-from-right-2 dark:data-[side=right]:slide-in-from-left-2 dark:data-[side=top]:slide-in-from-bottom-2 dark:origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "dark:relative dark:flex dark:cursor-default dark:select-none dark:items-center dark:gap-2 dark:rounded-sm dark:px-2 dark:py-1.5 dark:text-sm dark:outline-none dark:transition-colors dark:focus:bg-accent dark:focus:text-accent-foreground dark:data-[disabled]:pointer-events-none dark:data-[disabled]:opacity-50 dark:[&>svg]:size-4 dark:[&>svg]:shrink-0",
      inset && "dark:pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "dark:relative dark:flex dark:cursor-default dark:select-none dark:items-center dark:rounded-sm dark:py-1.5 dark:pl-8 dark:pr-2 dark:text-sm dark:outline-none dark:transition-colors dark:focus:bg-accent dark:focus:text-accent-foreground dark:data-[disabled]:pointer-events-none dark:data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="dark:absolute dark:left-2 dark:flex dark:h-3.5 dark:w-3.5 dark:items-center dark:justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="dark:h-4 dark:w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "dark:relative dark:flex dark:cursor-default dark:select-none dark:items-center dark:rounded-sm dark:py-1.5 dark:pl-8 dark:pr-2 dark:text-sm dark:outline-none dark:transition-colors dark:focus:bg-accent dark:focus:text-accent-foreground dark:data-[disabled]:pointer-events-none dark:data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="dark:absolute dark:left-2 dark:flex dark:h-3.5 dark:w-3.5 dark:items-center dark:justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="dark:h-2 dark:w-2 dark:fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "dark:px-2 dark:py-1.5 dark:text-sm dark:font-semibold",
      inset && "dark:pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("dark:-mx-1 dark:my-1 dark:h-px dark:bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("dark:ml-auto dark:text-xs dark:tracking-widest dark:opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
