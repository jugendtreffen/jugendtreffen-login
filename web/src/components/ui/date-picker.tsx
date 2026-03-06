import { PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns/format'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'
import { Popover, PopoverContent } from './popover'

interface DatepickerProps {
  name: string
  formControl: any
  value: Date
  onChange: any
  placeholder?: Date
}

const Datepicker = ({ name, formControl, ...props }: DatepickerProps) => {
  const [open, setOpen] = React.useState(false)

  console.log(props.value)

  return (
    <InputGroup>
      <InputGroupInput
        id={name}
        value={format(props.value, 'dd.MM.yyyy')}
        placeholder={format(props.placeholder, 'dd.MM.yyyy')}
        onChange={props.onChange}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              id="date-picker"
              variant="ghost"
              size="icon-xs"
              aria-label="Select date"
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={props.value as Date}
              onSelect={props.onChange}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { Datepicker }
