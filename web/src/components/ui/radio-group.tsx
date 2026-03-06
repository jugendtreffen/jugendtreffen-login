import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import * as React from 'react'

import { cn } from 'src/lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('dark:grid dark:gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'dark:aspect-square dark:h-4 dark:w-4 dark:rounded-full dark:border dark:border-primary dark:text-primary dark:shadow dark:focus:outline-none dark:focus-visible:ring-1 dark:focus-visible:ring-ring dark:disabled:cursor-not-allowed dark:disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="dark:flex dark:items-center dark:justify-center">
        <Circle className="dark:h-3.5 dark:w-3.5 dark:fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
