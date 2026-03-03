import {
  RegistrationInput,
  RegistrationSchema,
} from '@/components/EventRegistrationForm/EventRegistrationSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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

  const onSubmit = (input: RegistrationInput) => {
    console.log('Redwood multistep submitted:', input)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Anmeldung {event.name}</CardTitle>
        <FieldDescription>{event.desc}</FieldDescription>
      </CardHeader>
      <CardContent>
        <Form formMethods={registrationForm} onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              name={'name'}
              control={registrationForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="registerform-name">Vorname</FieldLabel>
                  <Input
                    id="registerform-name"
                    placeholder="Vorname"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'familyName'}
              control={registrationForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="registerform-family-name">
                    Nachname
                  </FieldLabel>
                  <Input
                    id="registerform-family-name"
                    placeholder="Nachname"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name={'email'}
              control={registrationForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="registerform-email">
                    E-Mail-Addresse
                  </FieldLabel>
                  <Input
                    id="registerform-email"
                    placeholder="E-Mail"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
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
            </Field>
          </FieldGroup>

          <Button type="submit">Submit</Button>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EventRegistrationForm
