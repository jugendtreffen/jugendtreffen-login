import { cva, type VariantProps } from 'class-variance-authority'
import { useMemo } from 'react'

import { Label } from 'src/components/ui/label'
import { Separator } from 'src/components/ui/separator'
import { cn } from 'src/lib/utils'

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'dark:flex dark:flex-col dark:gap-6',
        'dark:has-[>[data-slot=checkbox-group]]:gap-3 dark:has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'dark:mb-3 dark:font-medium',
        'dark:data-[variant=legend]:text-base',
        'dark:data-[variant=label]:text-sm',
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'dark:group/field-group dark:@container/field-group dark:flex dark:w-full dark:flex-col dark:gap-7 dark:data-[slot=checkbox-group]:gap-3 dark:[&>[data-slot=field-group]]:gap-4',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  'dark:group/field dark:data-[invalid=true]:text-destructive dark:flex dark:w-full dark:gap-3',
  {
    variants: {
      orientation: {
        vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
        horizontal: [
          'flex-row items-center',
          '[&>[data-slot=field-label]]:flex-auto',
          'has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start',
        ],
        responsive: [
          '@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto',
          '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
          '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'dark:group/field-content dark:flex dark:flex-1 dark:flex-col dark:gap-1.5 dark:leading-snug',
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'dark:group/field-label dark:peer/field-label dark:flex dark:w-fit dark:gap-2 dark:leading-snug dark:group-data-[disabled=true]/field:opacity-50',
        'dark:has-[>[data-slot=field]]:w-full dark:has-[>[data-slot=field]]:flex-col dark:has-[>[data-slot=field]]:rounded-md dark:has-[>[data-slot=field]]:border dark:[&>[data-slot=field]]:p-4',
        'dark:has-data-[state=checked]:border-primary',
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'dark:flex dark:w-fit dark:items-center dark:gap-2 dark:text-sm dark:font-medium dark:leading-snug dark:group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'dark:text-muted-foreground dark:text-sm dark:font-normal dark:leading-normal dark:group-has-[[data-orientation=horizontal]]/field:text-balance',
        'dark:nth-last-2:-mt-1 dark:last:mt-0 dark:[[data-variant=legend]+&]:-mt-1.5',
        'dark:[&>a:hover]:text-primary dark:[&>a]:underline dark:[&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'dark:relative dark:-my-2 dark:h-5 dark:text-sm dark:group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      {...props}
    >
      <Separator className="dark:absolute dark:inset-0 dark:top-1/2" />
      {children && (
        <span
          className="dark:bg-background dark:text-muted-foreground dark:relative dark:mx-auto dark:block dark:w-fit dark:px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="dark:ml-4 dark:flex dark:list-disc dark:flex-col dark:gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        'dark:text-destructive dark:text-sm dark:font-normal',
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
