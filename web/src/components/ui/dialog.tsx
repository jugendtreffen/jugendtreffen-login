import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "src/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "dark:fixed dark:inset-0 dark:z-50 dark:bg-black/80 dark: dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "dark:fixed dark:left-[50%] dark:top-[50%] dark:z-50 dark:grid dark:w-full dark:max-w-lg dark:translate-x-[-50%] dark:translate-y-[-50%] dark:gap-4 dark:border dark:bg-background dark:p-6 dark:shadow-lg dark:duration-200 dark:data-[state=open]:animate-in dark:data-[state=closed]:animate-out dark:data-[state=closed]:fade-out-0 dark:data-[state=open]:fade-in-0 dark:data-[state=closed]:zoom-out-95 dark:data-[state=open]:zoom-in-95 dark:data-[state=closed]:slide-out-to-left-1/2 dark:data-[state=closed]:slide-out-to-top-[48%] dark:data-[state=open]:slide-in-from-left-1/2 dark:data-[state=open]:slide-in-from-top-[48%] dark:sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="dark:absolute dark:right-4 dark:top-4 dark:rounded-sm dark:opacity-70 dark:ring-offset-background dark:transition-opacity dark:hover:opacity-100 dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-ring dark:focus:ring-offset-2 dark:disabled:pointer-events-none dark:data-[state=open]:bg-accent dark:data-[state=open]:text-muted-foreground">
        <X className="dark:h-4 dark:w-4" />
        <span className="dark:sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "dark:flex dark:flex-col dark:space-y-1.5 dark:text-center dark:sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "dark:text-lg dark:font-semibold dark:leading-none dark:tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("dark:text-sm dark:text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
