"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "src/lib/utils"
import { Dialog, DialogContent } from "src/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "dark:flex dark:h-full dark:w-full dark:flex-col dark:overflow-hidden dark:rounded-md dark:bg-popover dark:text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="dark:overflow-hidden dark:p-0">
        <Command className="dark:[&_[cmdk-group-heading]]:px-2 dark:[&_[cmdk-group-heading]]:font-medium dark:[&_[cmdk-group-heading]]:text-muted-foreground dark:[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 dark:[&_[cmdk-group]]:px-2 dark:[&_[cmdk-input-wrapper]_svg]:h-5 dark:[&_[cmdk-input-wrapper]_svg]:w-5 dark:[&_[cmdk-input]]:h-12 dark:[&_[cmdk-item]]:px-2 dark:[&_[cmdk-item]]:py-3 dark:[&_[cmdk-item]_svg]:h-5 dark:[&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="dark:flex dark:items-center dark:border-b dark:px-3" cmdk-input-wrapper="">
    <Search className="dark:mr-2 dark:h-4 dark:w-4 dark:shrink-0 dark:opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "dark:flex dark:h-10 dark:w-full dark:rounded-md dark:bg-transparent dark:py-3 dark:text-sm dark:outline-none dark:placeholder:text-muted-foreground dark:disabled:cursor-not-allowed dark:disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("dark:max-h-[300px] dark:overflow-y-auto dark:overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="dark:py-6 dark:text-center dark:text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "dark:overflow-hidden dark:p-1 dark:text-foreground dark:[&_[cmdk-group-heading]]:px-2 dark:[&_[cmdk-group-heading]]:py-1.5 dark:[&_[cmdk-group-heading]]:text-xs dark:[&_[cmdk-group-heading]]:font-medium dark:[&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("dark:-mx-1 dark:h-px dark:bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "dark:relative dark:flex dark:cursor-default dark:gap-2 dark:select-none dark:items-center dark:rounded-sm dark:px-2 dark:py-1.5 dark:text-sm dark:outline-none dark:data-[disabled=true]:pointer-events-none dark:data-[selected=true]:bg-accent dark:data-[selected=true]:text-accent-foreground dark:data-[disabled=true]:opacity-50 dark:[&_svg]:pointer-events-none dark:[&_svg]:size-4 dark:[&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "dark:ml-auto dark:text-xs dark:tracking-widest dark:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
