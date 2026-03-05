import {
  RegistrationInput,
  RegistrationSchema,
} from '@/components/EventRegistrationForm/EventRegistrationSchema'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { LabeledInput } from '@/components/ui/labeled-input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, Form, useForm } from '@redwoodjs/forms'
import { format } from 'date-fns/format'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const EventRegistrationForm = ({ event }) => {
  const registrationForm = useForm({
    mode: 'onBlur',
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: '',
      familyName: '',
      email: '',
      birthdate: new Date(),
    },
  })
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const onSubmit = (input: RegistrationInput) => {
    console.log('Redwood multistep submitted:', input)
  }

  return (
    <Form formMethods={registrationForm} onSubmit={onSubmit}>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-2">
          <LabeledInput
            name={'name'}
            label={'Vorname'}
            formControl={registrationForm.control}
          />
        </div>

        <div className="col-span-2">
          <LabeledInput
            name={'familyName'}
            label={'Nachname'}
            formControl={registrationForm.control}
          />
        </div>

        <div className="col-span-2">
          <LabeledInput
            name={'email'}
            label={'E-Mail'}
            formControl={registrationForm.control}
          />
        </div>

        <div className="col-span-2">
          <Controller
            name={'birthdate'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field className="mx-auto w-44" data-invalid={fieldState.error}>
                <FieldLabel htmlFor="date">Geburtstag</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="justify-start font-normal"
                    >
                      {date ? format(date, 'dd.MM.yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0!"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      defaultMonth={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date)
                        setOpen(false)
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="col-span-2">
          <LabeledInput
            name={'phoneNumber'}
            label={'Telefonnummer'}
            formControl={registrationForm.control}
            placeholder={'+43 123 456789'}
          />
        </div>

        <div className="col-span-2">
          <LabeledInput
            name={'phoneCaretakerContact'}
            label={'Telefonnummer Erziehungsberechtigte/r'}
            formControl={registrationForm.control}
            placeholder={'+43 123 456789'}
          />
        </div>

        <div className="col-span-2">
          <Controller
            name={'gender'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <Select>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Wähle dein Geschlecht" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Männlich</SelectItem>
                      <SelectItem value="female">Weiblich</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="col-span-2">
          <Controller
            name={'country'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <Select>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Land" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="AT">Österreich</SelectItem>
                      <SelectItem value="DE">Deutschland</SelectItem>
                      <SelectItem value="IT">Italien</SelectItem>
                      <SelectItem value="FR">Frankreich</SelectItem>
                      <SelectItem value="HU">Ungarn</SelectItem>
                      <SelectItem value="CH">Schweiz</SelectItem>
                      <SelectItem value="LU">Luxemburg</SelectItem>
                      <SelectItem value="--">Anderes</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="col-span-1">
          <LabeledInput
            name={'postalCode'}
            label={'Postleitzahl'}
            formControl={registrationForm.control}
          />
        </div>

        <div className="col-span-3">
          <LabeledInput
            name={'city'}
            label={'Stadt'}
            formControl={registrationForm.control}
          />
        </div>

        <div className="col-span-4">
          <LabeledInput
            name={'address'}
            label={'Addresse'}
            formControl={registrationForm.control}
          />
        </div>
      </div>

      <Button type="submit">Submit</Button>
    </Form>
  )
}

export default EventRegistrationForm
