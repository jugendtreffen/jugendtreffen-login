import { useEffect, useState } from 'react'
import { isValid, parse } from 'date-fns'
import { format } from 'date-fns/format'
import { CalendarIcon } from 'lucide-react'

import { PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from './calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'
import { Popover, PopoverContent } from './popover'
import {useMediaQuery} from "@/hooks/MediaQueryHook";

interface DatepickerProps {
  name: string
  formControl: any
  value: Date
  onChange: any
  placeholder?: Date
  invalid?: boolean
  min?: Date
  max?: Date
}

const Datepicker = ({
  name,
  formControl,
  value,
  ...props
}: DatepickerProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    value instanceof Date && isValid(value) ? format(value, 'dd.MM.yyyy') : ''
  )

  useEffect(() => {
    if (value instanceof Date && isValid(value)) {
      setInputValue(format(value, 'dd.MM.yyyy'))
    }
  }, [value])

  return (
    <InputGroup aria-invalid={props.invalid}>
      <InputGroupInput
        id={name}
        value={inputValue}
        readOnly={open}
        placeholder={
          props.placeholder ? format(props.placeholder, 'dd.MM.yyyy') : ''
        }
        onChange={(event) => {
          let raw = event.target.value.replace(/\D/g, '') // nur Ziffern
          if (raw.length > 2) raw = raw.slice(0, 2) + '.' + raw.slice(2)
          if (raw.length > 5) raw = raw.slice(0, 5) + '.' + raw.slice(5)
          raw = raw.slice(0, 10)

          setInputValue(raw)

          const parsed = parse(raw, 'dd.MM.yyyy', new Date())
          if (raw.length === 10 && isValid(parsed)) {
            props.onChange(parsed)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        aria-invalid={props.invalid}
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
            className="w-auto overflow-hidden p-0!"
            align="end"
            alignOffset={-8}
            sideOffset={10}
            onTouchStart={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={value}
              month={value}
              captionLayout={ isMobile ? "label": "dropdown"}
              onSelect={(event) => {
                props.onChange(event)
                setOpen(false)
              }}
              onMonthChange={(event) => {
                if (event instanceof Date && isValid(event)) {
                  props.onChange(event)
                }
              }}
              disabled={(date) => {
                const tooLate = props.max !== undefined && date > props.max
                const tooEarly = props.min !== undefined && date < props.min
                return tooLate || tooEarly
              }}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}

export { Datepicker }
