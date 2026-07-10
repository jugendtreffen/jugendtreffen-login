import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "src/hooks/use-mobile"
import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Separator } from "src/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "src/components/ui/sheet"
import { Skeleton } from "src/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "dark:group/sidebar-wrapper dark:flex dark:min-h-svh dark:w-full dark:has-data-[variant=inset]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "dark:flex dark:h-full dark:w-[--sidebar-width] dark:flex-col dark:bg-sidebar dark:text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="dark:w-[--sidebar-width] dark:bg-sidebar dark:p-0 dark:text-sidebar-foreground dark:[&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetHeader className="dark:sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="dark:flex dark:h-full dark:w-full dark:flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="dark:group dark:peer dark:hidden dark:text-sidebar-foreground dark:md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "dark:relative dark:w-[--sidebar-width] dark:bg-transparent dark:transition-[width] dark:duration-200 dark:ease-linear",
            "dark:group-data-[collapsible=offcanvas]:w-0",
            "dark:group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "dark:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "dark:group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "dark:fixed dark:inset-y-0 dark:z-10 dark:hidden dark:h-svh dark:w-[--sidebar-width] dark:transition-[left,right,width] dark:duration-200 dark:ease-linear dark:md:flex",
            side === "left"
              ? "dark:left-0 dark:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "dark:right-0 dark:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "dark:p-2 dark:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "dark:group-data-[collapsible=icon]:w-[--sidebar-width-icon] dark:group-data-[side=left]:border-r dark:group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="dark:flex dark:h-full dark:w-full dark:flex-col dark:bg-sidebar dark:group-data-[variant=floating]:rounded-lg dark:group-data-[variant=floating]:border dark:group-data-[variant=floating]:border-sidebar-border dark:group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("dark:h-7 dark:w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="dark:sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "dark:absolute dark:inset-y-0 dark:z-20 dark:hidden dark:w-4 dark:-translate-x-1/2 dark:transition-all dark:ease-linear dark:after:absolute dark:after:inset-y-0 dark:after:left-1/2 dark:after:w-0.5 dark:hover:after:bg-sidebar-border dark:group-data-[side=left]:-right-4 dark:group-data-[side=right]:left-0 dark:sm:flex",
        "dark:[[data-side=left]_&]:cursor-w-resize dark:[[data-side=right]_&]:cursor-e-resize",
        "dark:[[data-side=left][data-state=collapsed]_&]:cursor-e-resize dark:[[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "dark:group-data-[collapsible=offcanvas]:translate-x-0 dark:group-data-[collapsible=offcanvas]:after:left-full dark:group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "dark:[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "dark:[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "dark:relative dark:flex dark:w-full dark:flex-1 dark:flex-col dark:bg-background",
        "dark:md:peer-data-[variant=inset]:m-2 dark:md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 dark:md:peer-data-[variant=inset]:ml-0 dark:md:peer-data-[variant=inset]:rounded-xl dark:md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "dark:h-8 dark:w-full dark:bg-background dark:shadow-none dark:focus-visible:ring-2 dark:focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("dark:flex dark:flex-col dark:gap-2 dark:p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("dark:flex dark:flex-col dark:gap-2 dark:p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("dark:mx-2 dark:w-auto dark:bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "dark:flex dark:min-h-0 dark:flex-1 dark:flex-col dark:gap-2 dark:overflow-auto dark:group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("dark:relative dark:flex dark:w-full dark:min-w-0 dark:flex-col dark:p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "dark:flex dark:h-8 dark:shrink-0 dark:items-center dark:rounded-md dark:px-2 dark:text-xs dark:font-medium dark:text-sidebar-foreground/70 dark:outline-none dark:ring-sidebar-ring dark:transition-[margin,opacity] dark:duration-200 dark:ease-linear dark:focus-visible:ring-2 dark:[&>svg]:size-4 dark:[&>svg]:shrink-0",
        "dark:group-data-[collapsible=icon]:-mt-8 dark:group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "dark:absolute dark:right-3 dark:top-3.5 dark:flex dark:aspect-square dark:w-5 dark:items-center dark:justify-center dark:rounded-md dark:p-0 dark:text-sidebar-foreground dark:outline-none dark:ring-sidebar-ring dark:transition-transform dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:focus-visible:ring-2 dark:[&>svg]:size-4 dark:[&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "dark:after:absolute dark:after:-inset-2 dark:after:md:hidden",
        "dark:group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("dark:w-full dark:text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("dark:flex dark:w-full dark:min-w-0 dark:flex-col dark:gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("dark:group/menu-item dark:relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "dark:peer/menu-button dark:flex dark:w-full dark:items-center dark:gap-2 dark:overflow-hidden dark:rounded-md dark:p-2 dark:text-left dark:text-sm dark:outline-none dark:ring-sidebar-ring dark:transition-[width,height,padding] dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:focus-visible:ring-2 dark:active:bg-sidebar-accent dark:active:text-sidebar-accent-foreground dark:disabled:pointer-events-none dark:disabled:opacity-50 dark:group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 dark:aria-disabled:pointer-events-none dark:aria-disabled:opacity-50 dark:data-[active=true]:bg-sidebar-accent dark:data-[active=true]:font-medium dark:data-[active=true]:text-sidebar-accent-foreground dark:data-[state=open]:hover:bg-sidebar-accent dark:data-[state=open]:hover:text-sidebar-accent-foreground dark:group-data-[collapsible=icon]:!size-8 dark:group-data-[collapsible=icon]:!p-2 dark:[&>span:last-child]:truncate dark:[&>svg]:size-4 dark:[&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground",
        outline:
          "dark:bg-background dark:shadow-[0_0_0_1px_hsl(var(--sidebar-border))] dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "dark:h-8 dark:text-sm",
        sm: "dark:h-7 dark:text-xs",
        lg: "dark:h-12 dark:text-sm dark:group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "dark:absolute dark:right-1 dark:top-1.5 dark:flex dark:aspect-square dark:w-5 dark:items-center dark:justify-center dark:rounded-md dark:p-0 dark:text-sidebar-foreground dark:outline-none dark:ring-sidebar-ring dark:transition-transform dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:focus-visible:ring-2 dark:peer-hover/menu-button:text-sidebar-accent-foreground dark:[&>svg]:size-4 dark:[&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "dark:after:absolute dark:after:-inset-2 dark:after:md:hidden",
        "dark:peer-data-[size=sm]/menu-button:top-1",
        "dark:peer-data-[size=default]/menu-button:top-1.5",
        "dark:peer-data-[size=lg]/menu-button:top-2.5",
        "dark:group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "dark:group-focus-within/menu-item:opacity-100 dark:group-hover/menu-item:opacity-100 dark:data-[state=open]:opacity-100 dark:peer-data-[active=true]/menu-button:text-sidebar-accent-foreground dark:md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "dark:pointer-events-none dark:absolute dark:right-1 dark:flex dark:h-5 dark:min-w-5 dark:select-none dark:items-center dark:justify-center dark:rounded-md dark:px-1 dark:text-xs dark:font-medium dark:tabular-nums dark:text-sidebar-foreground",
      "dark:peer-hover/menu-button:text-sidebar-accent-foreground dark:peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "dark:peer-data-[size=sm]/menu-button:top-1",
      "dark:peer-data-[size=default]/menu-button:top-1.5",
      "dark:peer-data-[size=lg]/menu-button:top-2.5",
      "dark:group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("dark:flex dark:h-8 dark:items-center dark:gap-2 dark:rounded-md dark:px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="dark:size-4 dark:rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="dark:h-4 dark:max-w-[--skeleton-width] dark:flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "dark:mx-3.5 dark:flex dark:min-w-0 dark:translate-x-px dark:flex-col dark:gap-1 dark:border-l dark:border-sidebar-border dark:px-2.5 dark:py-0.5",
      "dark:group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "dark:flex dark:h-7 dark:min-w-0 dark:-translate-x-px dark:items-center dark:gap-2 dark:overflow-hidden dark:rounded-md dark:px-2 dark:text-sidebar-foreground dark:outline-none dark:ring-sidebar-ring dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground dark:focus-visible:ring-2 dark:active:bg-sidebar-accent dark:active:text-sidebar-accent-foreground dark:disabled:pointer-events-none dark:disabled:opacity-50 dark:aria-disabled:pointer-events-none dark:aria-disabled:opacity-50 dark:[&>span:last-child]:truncate dark:[&>svg]:size-4 dark:[&>svg]:shrink-0 dark:[&>svg]:text-sidebar-accent-foreground",
        "dark:data-[active=true]:bg-sidebar-accent dark:data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "dark:text-xs",
        size === "md" && "dark:text-sm",
        "dark:group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
