import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { forwardRef } from 'react'

import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Textarea } from 'src/components/ui/textarea'
import { cn } from 'src/lib/utils'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'dark:group/input-group dark:border-input dark:bg-input/30 dark:shadow-xs dark:relative dark:flex dark:w-full dark:items-center dark:rounded-md dark:border dark:outline-none dark:transition-[color,box-shadow]',
        'dark:h-9 dark:has-[>textarea]:h-auto',

        // Variants based on alignment.
        'dark:has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'dark:has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'dark:has-[>[data-align=block-start]]:h-auto dark:has-[>[data-align=block-start]]:flex-col dark:has-[>[data-align=block-start]]:[&>input]:pb-3',
        'dark:has-[>[data-align=block-end]]:h-auto dark:has-[>[data-align=block-end]]:flex-col dark:has-[>[data-align=block-end]]:[&>input]:pt-3',

        // Focus state.
        'dark:has-[[data-slot=input-group-control]:focus-visible]:ring-ring dark:has-[[data-slot=input-group-control]:focus-visible]:ring-1',

        // Error state.
        'dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  'dark:text-muted-foreground dark:flex dark:h-auto dark:cursor-text dark:select-none dark:items-center dark:justify-center dark:gap-2 dark:py-1.5 dark:text-sm dark:font-medium dark:group-data-[disabled=true]/input-group:opacity-50 dark:[&>kbd]:rounded-[calc(var(--radius)-5px)] dark:[&>svg:not([class*=size-])]:size-4',
  {
    variants: {
      align: {
        'inline-start':
          'dark:order-first dark:pl-3 dark:has-[>button]:ml-[-0.45rem] dark:has-[>kbd]:ml-[-0.35rem]',
        'inline-end':
          'dark:order-last dark:pr-3 dark:has-[>button]:mr-[-0.4rem] dark:has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          'dark:[.border-b]:pb-3 dark:order-first dark:w-full dark:justify-start dark:px-3 dark:pt-3 dark:group-has-[>input]/input-group:pt-2.5',
        'block-end':
          'dark:[.border-t]:pt-3 dark:order-last dark:w-full dark:justify-start dark:px-3 dark:pb-3 dark:group-has-[>input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  'dark:flex dark:items-center dark:gap-2 dark:text-sm dark:shadow-none',
  {
    variants: {
      size: {
        xs: 'dark:h-6 dark:gap-1 dark:rounded-[calc(var(--radius)-5px)] dark:px-2 dark:has-[>svg]:px-2 dark:[&>svg:not([class*=size-])]:size-3.5',
        sm: 'dark:h-8 dark:gap-1.5 dark:rounded-md dark:px-2.5 dark:has-[>svg]:px-2.5',
        'icon-xs':
          'dark:size-6 dark:rounded-[calc(var(--radius)-5px)] dark:p-0 dark:has-[>svg]:p-0',
        'icon-sm': 'dark:size-8 dark:p-0 dark:has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

const InputGroupButton = forwardRef<
  React.ElementRef<typeof Button>,
  Omit<React.ComponentProps<typeof Button>, 'size'> &
    VariantProps<typeof inputGroupButtonVariants>
>(function InputGroupButton(
  { className, type = 'button', variant = 'ghost', size = 'xs', ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
})

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'dark:text-muted-foreground dark:flex dark:items-center dark:gap-2 dark:text-sm dark:[&_svg:not([class*=size-])]:size-4 dark:[&_svg]:pointer-events-none',
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'dark:flex-1 dark:rounded-none dark:border-0 dark:bg-transparent dark:shadow-none dark:focus-visible:ring-0 dark:bg-transparent',
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'dark:flex-1 dark:resize-none dark:rounded-none dark:border-0 dark:bg-transparent dark:py-3 dark:shadow-none dark:focus-visible:ring-0 dark:bg-transparent',
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}
