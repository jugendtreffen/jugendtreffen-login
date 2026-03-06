import { cva, type VariantProps } from 'class-variance-authority'

import {
  ToggleHighlight as ToggleHighlightPrimitive,
  ToggleItem as ToggleItemPrimitive,
  Toggle as TogglePrimitive,
  type ToggleItemProps as ToggleItemPrimitiveProps,
  type ToggleProps as TogglePrimitiveProps,
} from 'src/components/animate-ui/primitives/radix/toggle'
import { cn } from 'src/lib/utils'

const toggleVariants = cva(
  'dark:inline-flex dark:items-center dark:justify-center dark:gap-2 dark:rounded-md dark:text-sm dark:font-medium dark:hover:bg-muted/40 dark:hover:text-muted-foreground dark:disabled:pointer-events-none dark:disabled:opacity-50 dark:data-[state=on]:text-accent-foreground dark:[&_svg]:pointer-events-none dark:[&_svg:not([class*=size-])]:size-4 dark:[&_svg]:shrink-0 dark:focus-visible:border-ring dark:focus-visible:ring-ring/50 dark:focus-visible:ring-[3px] dark:outline-none dark:transition-[color,background-color,box-shadow] dark:duration-200 dark:ease-in-out dark:aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive dark:whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'dark:bg-transparent',
        outline:
          'dark:border dark:border-input dark:bg-transparent dark:shadow-xs dark:hover:bg-accent/40 dark:hover:text-accent-foreground',
      },
      size: {
        default: 'dark:h-9 dark:px-2 dark:min-w-9',
        sm: 'dark:h-8 dark:px-1.5 dark:min-w-8',
        lg: 'dark:h-10 dark:px-2.5 dark:min-w-10',
        icon: 'dark:size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ToggleProps = TogglePrimitiveProps &
  ToggleItemPrimitiveProps &
  VariantProps<typeof toggleVariants>

function Toggle({
  className,
  variant,
  size,
  pressed,
  defaultPressed,
  onPressedChange,
  disabled,
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      className="dark:relative"
    >
      <ToggleHighlightPrimitive className="dark:bg-accent dark:rounded-md" />
      <ToggleItemPrimitive
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    </TogglePrimitive>
  )
}

export { Toggle, toggleVariants, type ToggleProps }
