import { Checkbox } from '@/components/animate-ui/components/radix/checkbox'
import { RegistrationInput, RegistrationSchema, } from '@/components/EventRegistrationForm/EventRegistrationSchema'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Datepicker } from '@/components/ui/date-picker'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { LabeledInput } from '@/components/ui/labeled-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, Form, useForm } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { CreateParticipantMutation, CreateParticipantMutationVariables, } from 'types/graphql'
import { Separator } from '../ui/separator'

const CREATE_PARTICIPANT = gql`
  mutation CreateRegisteredParticipantMutation(
    $input: CreateParticipantInput!
  ) {
    createParticipant(input: $input) {
      name
      familyName
      birthdate
      gender
      phoneNumber
      phoneCaretakerContact
      foundUsBy
      isParent
      country
      city
      postalCode
      address
      travelMethod
      accommodation
      startDate
      endDate
      foodChoice
      acceptPhotos
      acceptCoC
      eventId
      participationRole
    }
  }
`

const EventRegistrationForm = ({ event }) => {
  const registrationForm = useForm({
    mode: 'onBlur',
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: '',
      familyName: '',
      email: '',
      birthdate: new Date(),
      gender: '',
      phoneNumber: '',
      phoneCaretakerContact: '',
      country: '',
      city: '',
      postalCode: '',
      address: '',
      travelMethod: '',
      accommodation: '',
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      foodChoice: '',
      acceptPhotos: false,
      participationRole: '',
    },
  })
  const [createParticipant, { loading }] = useMutation<
    CreateParticipantMutation,
    CreateParticipantMutationVariables
  >(CREATE_PARTICIPANT, {
    onCompleted: () => {
      toast.success('Deine Teilnahme wurde gespeichert')
      registrationForm.reset()
    },
  })
  const [hasOpenedLink, setHasOpenedLink] = useState(false)

  const onSubmit = async (input: RegistrationInput) => {
    console.log('Redwood multistep submitted:', input)
    const variables = {
      input: {
        eventId: event.id,
        isParent: false, // TODO: what to do with this field
        ...input,
      },
    }

    await createParticipant({
      variables: variables,
    }).catch(console.error)
  }

  const isParticipant =
    registrationForm.watch('participationRole') === 'teilnehmer' ||
    registrationForm.watch('participationRole') === undefined

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
                <FieldLabel htmlFor={'birthdate'}>Geburtstag</FieldLabel>
                <Datepicker
                  name={'birthdate'}
                  formControl={registrationForm.control}
                  value={field.value as Date}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                  max={new Date()}
                />
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
                <FieldLabel htmlFor={'gender'}>Geschlecht</FieldLabel>
                <Select
                  name={'gender'}
                  onValueChange={field.onChange}
                  value={field.value}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
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

        <Separator className="col-span-4 my-4" />

        <div className="col-span-4">
          <Controller
            name={'country'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor={'country'}>Land</FieldLabel>
                <Select
                  name={'country'}
                  onValueChange={field.onChange}
                  value={field.value}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
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

        <Separator className="col-span-4 my-4" />

        <div className="col-span-2">
          <Controller
            name={'travelMethod'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor={'travelMethod'}>Anreise</FieldLabel>
                <Select
                  name={'travelMethod'}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="car">mit dem Auto</SelectItem>
                      <SelectItem value="train">mit dem Zug</SelectItem>
                      <SelectItem value="other">Anderes</SelectItem>
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

        {/*TODO: refactor Labels to reusable enum*/}
        <div className="col-span-2">
          <Controller
            name={'participationRole'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor={'participationRole'}>
                  Ich nehme Teil als...
                </FieldLabel>
                <Select
                  name={'participationRole'}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="teilnehmer">Teilnehmer</SelectItem>
                      <SelectItem value="priester">Priester</SelectItem>
                      <SelectItem value="begleitperson">
                        Begleitperson
                      </SelectItem>
                      <SelectItem value="ordensmann/ordensfrau">
                        Ordensmann/Ordensfrau
                      </SelectItem>
                      <SelectItem value="vortragender">Vortragender</SelectItem>
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
            name={'accommodation'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor={'accommodation'}>Unterkunft</FieldLabel>
                <RadioGroup
                  name={'accommodation'}
                  className="w-full"
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  {isParticipant ? (
                    <Card className="flex items-center gap-3 p-3">
                      <RadioGroupItem
                        value="jugendtreffen"
                        id="jugendtreffen"
                      />
                      <Label htmlFor="jugendtreffen">beim Jugendtreffen</Label>
                    </Card>
                  ) : (
                    <>
                      <Card className="flex items-center gap-3 p-3">
                        <RadioGroupItem value="subiaco" id="subiaco" />
                        <Label htmlFor="subiaco">Haus Subiaco</Label>
                      </Card>
                      <Card className="flex items-center gap-3 p-3">
                        <RadioGroupItem value="family" id="family" />
                        <Label htmlFor="family">bei einer familie</Label>
                      </Card>
                    </>
                  )}
                  <Card className="flex items-center gap-3 p-3">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">eine Private</Label>
                  </Card>
                </RadioGroup>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4">
          <Label htmlFor={'startDate'}>Ich nehme teil von:</Label>
          <div className="flex felx-row gap-3 items-center">
            <Controller
              name={'startDate'}
              control={registrationForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Datepicker
                    name={'startDate'}
                    formControl={registrationForm.control}
                    value={field.value as Date}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    min={new Date(event.startDate)}
                    max={new Date(event.endDate)}
                  />
                </Field>
              )}
            />
            <span className="text-muted-foreground">bis</span>
            <Controller
              name={'endDate'}
              control={registrationForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Datepicker
                    name={'endDate'}
                    formControl={registrationForm.control}
                    value={field.value as Date}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    min={new Date(event.startDate)}
                    max={new Date(event.endDate)}
                  />
                </Field>
              )}
            />
          </div>
        </div>

        <div className="col-span-2">
          <Controller
            name={'foodChoice'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor={'foodChoice'}>Ich esse</FieldLabel>
                <RadioGroup
                  name={'foodChoice'}
                  className="w-full"
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  <Card className="flex items-center gap-3 p-3">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">eigentlich alles</Label>
                  </Card>
                  <Card className="flex items-center gap-3 p-3">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian">vegetarisch</Label>
                  </Card>
                </RadioGroup>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 py-4">
          <Controller
            name={'acceptCoC'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={'acceptCoC'}
                  className="flex items-center gap-x-3"
                >
                  <Checkbox
                    name={'acceptCoC'}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!hasOpenedLink}
                    aria-invalid={fieldState.invalid}
                  />
                  Ich habe den{' '}
                  <a
                    onClick={() => setHasOpenedLink(true)}
                    href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline inline-flex"
                  >
                    Verhaltenscodex
                    <ArrowUpRight className="h-4" />
                  </a>{' '}
                  gelesen und akzeptiere diesen.
                </FieldLabel>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 py-4">
          <Controller
            name={'acceptPhotos'}
            control={registrationForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={'acceptPhotos'}
                  className="flex items-center gap-x-3"
                >
                  <Checkbox
                    name={'acceptPhotos'}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  Ich stimme zu, fotografiert oder gefilmt werden zu dürfen.
                </FieldLabel>
              </Field>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="col-span-4">
          {loading && <Spinner />}
          Anmelden
        </Button>
      </div>
    </Form>
  )
}

export default EventRegistrationForm
