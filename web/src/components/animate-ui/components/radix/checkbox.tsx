import { cva, type VariantProps } from 'class-variance-authority'

import {
  CheckboxIndicator as CheckboxIndicatorPrimitive,
  Checkbox as CheckboxPrimitive,
  type CheckboxProps as CheckboxPrimitiveProps,
} from 'src/components/animate-ui/primitives/radix/checkbox'
import { cn } from 'src/lib/utils'

const checkboxVariants = cva(
  'dark:peer dark:shrink-0 dark:flex dark:items-center dark:justify-center dark:outline-none dark:focus-visible:ring-[3px] dark:focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:disabled:cursor-not-allowed dark:disabled:opacity-50 dark:transition-colors dark:duration-500 dark:focus-visible:ring-offset-2 dark:[&[data-state=checked],&[data-state=indeterminate]]:bg-primary dark:[&[data-state=checked],&[data-state=indeterminate]]:text-primary-foreground',
  {
    variants: {
      variant: {
        default: 'dark:bg-background dark:border',
        accent: 'dark:bg-input',
      },
      size: {
        default: 'dark:size-5 dark:rounded-sm',
        sm: 'dark:size-4.5 dark:rounded-[5px]',
        lg: 'dark:size-6 dark:rounded-[7px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const checkboxIndicatorVariants = cva('dark:', {
  variants: {
    size: {
      default: 'dark:size-3.5',
      sm: 'dark:size-3',
      lg: 'dark:size-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type CheckboxProps = CheckboxPrimitiveProps &
  VariantProps<typeof checkboxVariants>

function Checkbox({
  className,
  children,
  variant,
  size,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive
      className={cn(checkboxVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      <CheckboxIndicatorPrimitive
        className={cn(checkboxIndicatorVariants({ size }))}
      />
    </CheckboxPrimitive>
  )
}

export { Checkbox, type CheckboxProps }
