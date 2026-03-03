import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import * as React from 'react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { Button, buttonVariants } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'dark:bg-background dark:group/calendar dark:p-3 dark:[--cell-size:2rem] dark:[[data-slot=card-content]_&]:bg-transparent dark:[[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('dark:w-fit', defaultClassNames.root),
        months: cn(
          'dark:relative dark:flex dark:flex-col dark:gap-4 dark:md:flex-row',
          defaultClassNames.months
        ),
        month: cn(
          'dark:flex dark:w-full dark:flex-col dark:gap-4',
          defaultClassNames.month
        ),
        nav: cn(
          'dark:absolute dark:inset-x-0 dark:top-0 dark:flex dark:w-full dark:items-center dark:justify-between dark:gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'dark:h-[--cell-size] dark:w-[--cell-size] dark:select-none dark:p-0 dark:aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'dark:h-[--cell-size] dark:w-[--cell-size] dark:select-none dark:p-0 dark:aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'dark:flex dark:h-[--cell-size] dark:w-full dark:items-center dark:justify-center dark:px-[--cell-size]',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'dark:flex dark:h-[--cell-size] dark:w-full dark:items-center dark:justify-center dark:gap-1.5 dark:text-sm dark:font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'dark:has-focus:border-ring dark:border-input dark:shadow-xs dark:has-focus:ring-ring/50 dark:has-focus:ring-[3px] dark:relative dark:rounded-md dark:border',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'dark:bg-popover dark:absolute dark:inset-0 dark:opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'dark:select-none dark:font-medium',
          captionLayout === 'label'
            ? 'dark:text-sm'
            : 'dark:[&>svg]:text-muted-foreground dark:flex dark:h-8 dark:items-center dark:gap-1 dark:rounded-md dark:pl-2 dark:pr-1 dark:text-sm dark:[&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        table: 'dark:w-full dark:border-collapse',
        weekdays: cn('dark:flex', defaultClassNames.weekdays),
        weekday: cn(
          'dark:text-muted-foreground dark:flex-1 dark:select-none dark:rounded-md dark:text-[0.8rem] dark:font-normal',
          defaultClassNames.weekday
        ),
        week: cn('dark:mt-2 dark:flex dark:w-full', defaultClassNames.week),
        week_number_header: cn(
          'dark:w-[--cell-size] dark:select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'dark:text-muted-foreground dark:select-none dark:text-[0.8rem]',
          defaultClassNames.week_number
        ),
        day: cn(
          'dark:group/day dark:relative dark:aspect-square dark:h-full dark:w-full dark:select-none dark:p-0 dark:text-center dark:[&:first-child[data-selected=true]_button]:rounded-l-md dark:[&:last-child[data-selected=true]_button]:rounded-r-md',
          defaultClassNames.day
        ),
        range_start: cn(
          'dark:bg-accent dark:rounded-l-md',
          defaultClassNames.range_start
        ),
        range_middle: cn('dark:rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'dark:bg-accent dark:rounded-r-md',
          defaultClassNames.range_end
        ),
        today: cn(
          'dark:bg-accent dark:text-accent-foreground dark:rounded-md dark:data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'dark:text-muted-foreground dark:aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          'dark:text-muted-foreground dark:opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('dark:invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('dark:size-4', className)}
                {...props}
              />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('dark:size-4', className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn('dark:size-4', className)}
              {...props}
            />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="dark:flex dark:size-[--cell-size] dark:items-center dark:justify-center dark:text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'dark:data-[selected-single=true]:bg-primary dark:data-[selected-single=true]:text-primary-foreground dark:data-[range-middle=true]:bg-accent dark:data-[range-middle=true]:text-accent-foreground dark:data-[range-start=true]:bg-primary dark:data-[range-start=true]:text-primary-foreground dark:data-[range-end=true]:bg-primary dark:data-[range-end=true]:text-primary-foreground dark:group-data-[focused=true]/day:border-ring dark:group-data-[focused=true]/day:ring-ring/50 dark:flex dark:aspect-square dark:h-auto dark:w-full dark:min-w-[--cell-size] dark:flex-col dark:gap-1 dark:font-normal dark:leading-none dark:data-[range-end=true]:rounded-md dark:data-[range-middle=true]:rounded-none dark:data-[range-start=true]:rounded-md dark:group-data-[focused=true]/day:relative dark:group-data-[focused=true]/day:z-10 dark:group-data-[focused=true]/day:ring-[3px] dark:[&>span]:text-xs dark:[&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
