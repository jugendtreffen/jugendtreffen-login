import { type VariantProps } from 'class-variance-authority'

import { toggleVariants } from 'src/components/animate-ui/components/radix/toggle'
import {
  ToggleGroupHighlightItem as ToggleGroupHighlightItemPrimitive,
  ToggleGroupHighlight as ToggleGroupHighlightPrimitive,
  ToggleGroupItem as ToggleGroupItemPrimitive,
  type ToggleGroupItemProps as ToggleGroupItemPrimitiveProps,
  ToggleGroup as ToggleGroupPrimitive,
  type ToggleGroupProps as ToggleGroupPrimitiveProps,
  useToggleGroup as useToggleGroupPrimitive,
} from 'src/components/animate-ui/primitives/radix/toggle-group'
import { getStrictContext } from 'src/lib/get-strict-context'
import { cn } from 'src/lib/utils'

const [ToggleGroupProvider, useToggleGroup] =
  getStrictContext<VariantProps<typeof toggleVariants>>('ToggleGroupContext')

type ToggleGroupProps = ToggleGroupPrimitiveProps &
  VariantProps<typeof toggleVariants>

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-variant={variant}
      data-size={size}
      className={cn(
        'dark:group/toggle-group dark:flex dark:gap-0.5 dark:w-fit dark:items-center dark:rounded-lg dark:data-[variant=outline]:shadow-xs dark:data-[variant=outline]:border dark:data-[variant=outline]:p-0.5',
        className
      )}
      {...props}
    >
      <ToggleGroupProvider value={{ variant, size }}>
        {props.type === 'single' ? (
          <ToggleGroupHighlightPrimitive className="dark:bg-accent dark:rounded-md">
            {children}
          </ToggleGroupHighlightPrimitive>
        ) : (
          children
        )}
      </ToggleGroupProvider>
    </ToggleGroupPrimitive>
  )
}

type ToggleGroupItemProps = ToggleGroupItemPrimitiveProps &
  VariantProps<typeof toggleVariants>

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const { variant: contextVariant, size: contextSize } = useToggleGroup()
  const { type } = useToggleGroupPrimitive()

  return (
    <ToggleGroupHighlightItemPrimitive
      value={props.value}
      className={cn(type === 'multiple' && 'dark:bg-accent dark:rounded-md')}
    >
      <ToggleGroupItemPrimitive
        data-variant={contextVariant || variant}
        data-size={contextSize || size}
        className={cn(
          toggleVariants({
            variant: contextVariant || variant,
            size: contextSize || size,
          }),
          'dark:min-w-0 dark:border-0 dark:flex-1 dark:shrink-0 dark:shadow-none dark:rounded-md dark:focus:z-10 dark:focus-visible:z-10',
          className
        )}
        {...props}
      >
        {children}
      </ToggleGroupItemPrimitive>
    </ToggleGroupHighlightItemPrimitive>
  )
}

export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupItemProps,
  type ToggleGroupProps,
}
