import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function DateOfBirthPicker() {
  const [dob, setDob] = React.useState<Date | undefined>()

  const thisYear = new Date().getFullYear()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !dob && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dob ? format(dob, 'PPP') : <span>Date of birth</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dob}
          onSelect={setDob}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={thisYear}
          reverseYears
          navLayout="after"
          disabled={(date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
        />
      </PopoverContent>
    </Popover>
  )
}
