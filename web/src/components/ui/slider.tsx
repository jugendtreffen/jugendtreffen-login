"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "src/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "dark:relative dark:flex dark:w-full dark:touch-none dark:select-none dark:items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="dark:relative dark:h-1.5 dark:w-full dark:grow dark:overflow-hidden dark:rounded-full dark:bg-primary/20">
      <SliderPrimitive.Range className="dark:absolute dark:h-full dark:bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="dark:block dark:h-4 dark:w-4 dark:rounded-full dark:border dark:border-primary/50 dark:bg-background dark:shadow dark:transition-colors dark:focus-visible:outline-none dark:focus-visible:ring-1 dark:focus-visible:ring-ring dark:disabled:pointer-events-none dark:disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
