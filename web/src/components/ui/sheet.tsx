"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "src/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "dark:fixed dark:inset-0 dark:z-50 dark:bg-black/80 dark: dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "dark:fixed dark:z-50 dark:gap-4 dark:bg-background dark:p-6 dark:shadow-lg dark:transition dark:ease-in-out dark:data-[state=closed]:duration-300 dark:data-[state=open]:duration-500 dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "dark:inset-x-0 dark:top-0 dark:border-b dark:data-[state=closed]:slide-out-to-top dark:data-[state=open]:slide-in-from-top",
        bottom:
          "dark:inset-x-0 dark:bottom-0 dark:border-t dark:data-[state=closed]:slide-out-to-bottom dark:data-[state=open]:slide-in-from-bottom",
        left: "dark:inset-y-0 dark:left-0 dark:h-full dark:w-3/4 dark:border-r dark:data-[state=closed]:slide-out-to-left dark:data-[state=open]:slide-in-from-left dark:sm:max-w-sm",
        right:
          "dark:inset-y-0 dark:right-0 dark:h-full dark:w-3/4 dark:border-l dark:data-[state=closed]:slide-out-to-right dark:data-[state=open]:slide-in-from-right dark:sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close className="dark:absolute dark:right-4 dark:top-4 dark:rounded-sm dark:opacity-70 dark:ring-offset-background dark:transition-opacity dark:hover:opacity-100 dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-ring dark:focus:ring-offset-2 dark:disabled:pointer-events-none dark:data-[state=open]:bg-secondary">
        <X className="dark:h-4 dark:w-4" />
        <span className="dark:sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "dark:flex dark:flex-col dark:space-y-2 dark:text-center dark:sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "dark:flex dark:flex-col-reverse dark:sm:flex-row dark:sm:justify-end dark:sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("dark:text-lg dark:font-semibold dark:text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("dark:text-sm dark:text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
