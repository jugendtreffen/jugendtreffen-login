// import { Link, routes } from '@redwoodjs/router'
import { useState } from 'react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import QuartierCell from 'src/components/QuartierCell'

const today = new Date()
today.setHours(0, 0, 0, 0)

const QuartierPage = () => {
  const [selectedDate, setSelectedDate] = useState(today)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-64 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'dd.MM.yyyy', { locale: de })}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <QuartierCell date={selectedDate.toISOString().split('T')[0]}></QuartierCell>
    </div>
  )
}

export default QuartierPage
