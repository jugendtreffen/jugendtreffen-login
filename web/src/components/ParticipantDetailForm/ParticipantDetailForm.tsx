import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, Form, useForm } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { addDays } from 'date-fns'

import AlertCenter from '@/components/ui/Alert/AlertCenter'
import { Datepicker } from '@/components/ui/date-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { LabeledInput } from '@/components/ui/labeled-input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAlert } from '@/hooks/AlertHook'
import { Participant } from 'types/graphql'
import {
  EditInput,
  EditSchema,
} from '@/components/ParticipantDetailForm/ParticipantDetailSchema'
import { Checkbox } from '@/components/animate-ui/components/radix/checkbox'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const UPDATE_PARTICIPANT_MUTATION = gql`
  mutation UpdateParticipantDetail($id: String!, $input: UpdateParticipantInput!) {
    updateParticipant(id: $id, input: $input) {
      id
      name
      familyName
      birthdate
      gender
      email
      phoneNumber
      phoneCaretakerContact
      country
      postalCode
      city
      address
      travelMethod
      participationRole
      accommodation
      foodChoice
      startDate
      endDate
      acceptPhotos
      price
      bandColour
      checkinConfirmed
    }
  }
`

const FormSkeleton = () => (
  <div className="grid grid-cols-4 gap-4 p-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className={`col-span-4 ${i % 3 === 0 ? 'md:col-span-2' : ''} space-y-2`}>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
)

type Props = {
  participant: Participant
  loading: boolean
}

const ParticipantDetailForm = ({ participant, loading }: Props) => {
  const { addAlert } = useAlert()

  const [updateParticipant, { loading: saving }] = useMutation(
    UPDATE_PARTICIPANT_MUTATION,
    {
      onCompleted: () => addAlert('Änderungen gespeichert.', 'success'),
      onError: (e) => addAlert(`Fehler beim Speichern: ${e.message}`, 'error'),
    }
  )

  const form = useForm<EditInput>({
    mode: 'onBlur',
    resolver: zodResolver(EditSchema),
  })

  useEffect(() => {
    if (!participant) return
    form.reset({
      ...participant,
      birthdate: new Date(participant.birthdate),
      startDate: new Date(participant.startDate),
      endDate:   new Date(participant.endDate),
    })
  }, [participant])

  const onSubmit = (values: EditInput) => {
    updateParticipant({
      variables: {
        id: participant.id,
        input: values,
      },
    })
  }

  const participationRole = form.watch('participationRole')
  const isParticipant =
    participationRole === 'teilnehmer' || !participationRole

  const event = participant?.event

  if (loading) return <FormSkeleton />

  return (
    <Form formMethods={form} onSubmit={onSubmit}>
      <div className="grid grid-cols-4 gap-2">
        <p className="col-span-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide pt-2">
          Persönliche Daten
        </p>

        <div className="col-span-4 md:col-span-2">
          <LabeledInput
            name="name"
            label="Vorname"
            formControl={form.control}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <LabeledInput
            name="familyName"
            label="Nachname"
            formControl={form.control}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <LabeledInput
            name="email"
            label="E-Mail"
            formControl={form.control}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Controller
            name="birthdate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="birthdate">Geburtstag</FieldLabel>
                <Datepicker
                  name="birthdate"
                  formControl={form.control}
                  value={field.value as Date}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                  max={new Date()}
                />
              </Field>
            )}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <LabeledInput
            name="phoneNumber"
            label="Telefonnummer"
            formControl={form.control}
            placeholder="+43 123 456789"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <LabeledInput
            name="phoneCaretakerContact"
            label="Telefon Erziehungsberechtigte/r"
            formControl={form.control}
            placeholder="+43 123 456789"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="gender">Geschlecht</FieldLabel>
                <Select
                  name="gender"
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
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
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 md:col-span-2 h-full">
          <Controller
            name={'ageChecked'}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={'ageChecked'}
                  className="flex items-center gap-x-3 my-auto"
                >
                  <Checkbox
                    name={'ageChecked'}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  <p>Ich habe das Geburtsdatum überprüft</p>
                </FieldLabel>
              </Field>
            )}
          />
        </div>

        <Separator className="col-span-4 my-4" />

        {/* ── Adresse ── */}
        <p className="col-span-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Adresse
        </p>

        <div className="col-span-4">
          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="country">Land</FieldLabel>
                <Select
                  name="country"
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
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
                      <SelectItem value="--">Sonstige</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
        <div className="col-span-4 md:col-span-1">
          <LabeledInput
            name="postalCode"
            label="PLZ"
            formControl={form.control}
          />
        </div>
        <div className="col-span-4 md:col-span-3">
          <LabeledInput name="city" label="Stadt" formControl={form.control} />
        </div>
        <div className="col-span-4">
          <LabeledInput
            name="address"
            label="Adresse"
            formControl={form.control}
          />
        </div>

        <Separator className="col-span-4 my-4" />

        {/* ── Veranstaltung ── */}
        <p className="col-span-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Veranstaltung
        </p>

        <div className="col-span-4 md:col-span-2">
          <Controller
            name="travelMethod"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="travelMethod">Anreise</FieldLabel>
                <Select
                  name="travelMethod"
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="car">mit dem Auto</SelectItem>
                      <SelectItem value="train">mit dem Zug</SelectItem>
                      <SelectItem value="other">anders</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 md:col-span-2">
          <Controller
            name="participationRole"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="participationRole">
                  Teilnahme als
                </FieldLabel>
                <Select
                  name="participationRole"
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="teilnehmer">Teilnehmer</SelectItem>
                      <SelectItem value="priester">
                        (Ordens-)Priester
                      </SelectItem>
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
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 md:col-span-2">
          <Controller
            name="accommodation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="accommodation">Unterkunft</FieldLabel>
                <Select
                  name="accommodation"
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isParticipant && (
                        <SelectItem value="jugendtreffen">
                          beim Jugendtreffen
                        </SelectItem>
                      )}
                      <SelectItem value="subiaco">Haus Subiaco</SelectItem>
                      {!isParticipant && (
                        <SelectItem value="family">
                          bei einer Familie
                        </SelectItem>
                      )}
                      <SelectItem value="private">Privatunterkunft</SelectItem>
                      <SelectItem value="sonstige">Sonstiges</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 md:col-span-2">
          <Controller
            name="foodChoice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <FieldLabel htmlFor="foodChoice">Essenswahl</FieldLabel>
                <Select
                  name="foodChoice"
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger className="w-full max-w-96">
                    <SelectValue placeholder="Bitte wähle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="any">normal</SelectItem>
                      <SelectItem value="vegetarian">vegetarisch</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 md:col-span-2">
          <Label>Zeitraum</Label>
          <div className="flex flex-row gap-3 items-center mt-1">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Datepicker
                    name="startDate"
                    formControl={form.control}
                    value={field.value as Date}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    min={
                      event ? addDays(new Date(event.startDate), -1) : undefined
                    }
                    max={
                      event ? addDays(new Date(event.endDate), -1) : undefined
                    }
                  />
                </Field>
              )}
            />
            <span className="text-muted-foreground">bis</span>
            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Datepicker
                    name="endDate"
                    formControl={form.control}
                    value={field.value as Date}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                    min={event ? new Date(event.startDate) : undefined}
                    max={event ? new Date(event.endDate) : undefined}
                  />
                </Field>
              )}
            />
          </div>
        </div>

        <Separator className="col-span-4 my-4" />

        <p className="col-span-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Zustimmungen
        </p>

        <div className="col-span-4 md:col-span-2">
          <Controller
            name="acceptPhotos"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.error}>
                <Card>
                  <Label htmlFor="acceptPhotos">
                    <CardHeader className="p-3">
                      <CardTitle>
                        Foto- und Filmaufnahmen erlaubt
                        <Switch id="acceptPhotos" className="ms-3" value={field.value}></Switch>
                      </CardTitle>
                    </CardHeader>
                  </Label>
                </Card>
              </Field>
            )}
          />
        </div>

        <div className="col-span-4 md:col-span-2">
          <Controller
            name="parentConfirmationChecked"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.error}>
                  <Card>
                    <Label htmlFor="parentConfirmationChecked">
                      <CardHeader className="p-3">
                        <CardTitle>
                          Elternbestätigung abgegeben
                          <Switch
                              id="parentConfirmationChecked"
                              className="ms-3"
                              value={field.value}
                              onChange={field.onChange}
                          ></Switch>
                        </CardTitle>
                      </CardHeader>
                    </Label>
                </Card>
              </Field>
            )}></Controller>
        </div>
      </div>

      <AlertCenter className="mt-4" />
    </Form>
  )
}

export default ParticipantDetailForm
