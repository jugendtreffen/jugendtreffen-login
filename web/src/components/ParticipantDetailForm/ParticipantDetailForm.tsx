import {useEffect, useState} from 'react'

import {zodResolver} from '@hookform/resolvers/zod'
import {Controller, Form, useForm} from '@redwoodjs/forms'
import {useMutation} from '@redwoodjs/web'
import {addDays} from 'date-fns'

import AlertCenter from '@/components/ui/Alert/AlertCenter'
import {Datepicker} from '@/components/ui/date-picker'
import {Field, FieldLabel} from '@/components/ui/field'
import {Label} from '@/components/ui/label'
import {LabeledInput} from '@/components/ui/labeled-input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Separator} from '@/components/ui/separator'
import {Skeleton} from '@/components/ui/skeleton'
import {useAlert} from '@/hooks/AlertHook'
import {Participant, UpdateParticipantInput} from 'types/graphql'
import {
  ParticipantDetailType,
  ParticipantDetailSchema,
} from '@/components/ParticipantDetailForm/ParticipantDetailSchema'
import {Button} from "@/components/ui/button";
import {ArrowRight, Save, UserCheck} from "lucide-react";
import {MaskInput} from "../ui/mask-input"
import {useAuth} from "@/auth";
import {
  Dialog,
  DialogClose,
  DialogContent, DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/animate-ui/components/radix/checkbox";
import {ColorSwatch} from "@/components/ui/color-swatch";

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
    {Array.from({length: 12}).map((_, i) => (
      <div key={i} className={`col-span-4 ${i % 3 === 0 ? 'md:col-span-2' : ''} space-y-2`}>
        <Skeleton className="h-4 w-24"/>
        <Skeleton className="h-10 w-full"/>
      </div>
    ))}
  </div>
)

const bandColorDescMap = {
  "white_team": "Team",
  "red_mitarbeiter": "Mitarbeiter",
  "yellow_tagesgaeste": "Tagesgäste",
  "blue_ue18": "Über 18",
  "darkgreen_ue16": "Über 16",
  "lime_ue14": "Über 14",
}

type Props = {
  participant: Participant
  loading: boolean
}

const ParticipantDetailForm = ({participant, loading}: Props) => {
  const {addAlert} = useAlert()
  const {currentUser} = useAuth()
  const [ageChecked, setAgeChecked] = useState(false)
  const [parentConfirmationChecked, setParentConfirmationChecked] = useState(false)
  const [updateParticipant, {loading: saving}] = useMutation(
    UPDATE_PARTICIPANT_MUTATION,
    {
      onCompleted: () => addAlert('Änderungen gespeichert.', 'success'),
      onError: (e) => addAlert(`Fehler beim Speichern: ${e.message}`, 'error'),
    }
  )
  const form = useForm<ParticipantDetailType>({
    mode: 'onBlur',
    resolver: zodResolver(ParticipantDetailSchema),
  })

  useEffect(() => {
    if (!participant) return
    const {event, id, __typename, checkinConfirmed, ...formvalues} = participant
    form.reset({
      ...formvalues,
      birthdate: new Date(participant.birthdate),
      startDate: new Date(participant.startDate),
      endDate: new Date(participant.endDate),
    })
  }, [participant])

  const onCheckin = () => {
    const valid = form.trigger()
    if (!valid) {
      addAlert('Bitte korrigiere zuerst die Formularfehler.', 'error')
      return
    }

    const input: UpdateParticipantInput = {
      ...form.getValues(),
      checkinConfirmed: true,
    }
    updateParticipant({
      variables: {
        id: participant.id,
        input
      },
      onCompleted: () => {
        addAlert('Teilnehmer erfolgreich eingecheckt.', 'success')
      },
      onError: (e) => {
        addAlert(`Fehler beim Speichern: ${e.message}`, 'error')
      },
    })
  }

  const onSave = () => {
    const valid = form.trigger()
    if (!valid) {
      addAlert('Bitte korrigiere zuerst die Formularfehler.', 'error')
      return
    }

    const input: UpdateParticipantInput = {
      ...form.getValues(),
      checkinConfirmed: participant.checkinConfirmed,
    }
    updateParticipant({
      variables: {
        id: participant.id,
        input,
      },
      onCompleted: () => {
        addAlert('Teilnehmer erfolgreich gespeichert.', 'success')
      },
      onError: (e) => {
        addAlert(`Fehler beim Speichern: ${e.message}`, 'error')
      },
    })
  }

  const participationRole = form.watch('participationRole')
  const isParticipant =
    participationRole === 'teilnehmer' || !participationRole
  const event = participant?.event

  if (loading) return <FormSkeleton/>

  return (
    <Dialog>
      <Form formMethods={form}>
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
              name="gender"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="gender">Geschlecht</FieldLabel>
                  <Select
                    name="gender"
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger className="w-full max-w-96">
                      <SelectValue placeholder="Bitte wähle"/>
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
              name="birthdate"
              control={form.control}
              render={({field, fieldState}) => (
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
            <Field>
              <FieldLabel htmlFor='bandColour'>Bandfarbe</FieldLabel>
              <div className="flex flex-row gap-2 items-center">
                <ColorSwatch color={participant?.bandColour?.split("_").at(0) ?? "rgba(0,0,0,0)"}/>
                <p className={"text-muted-foreground"}>{
                  bandColorDescMap[participant.bandColour] ?? "keine Angabe"
                }</p>
              </div>

            </Field>
          </div>

          <Separator className="col-span-4 my-4"/>

          <p className="col-span-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Adresse
          </p>

          <div className="col-span-4">
            <Controller
              name="country"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="country">Land</FieldLabel>
                  <Select
                    name="country"
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger className="w-full max-w-96">
                      <SelectValue placeholder="Bitte wähle"/>
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
            <LabeledInput name="city" label="Stadt" formControl={form.control}/>
          </div>
          <div className="col-span-4">
            <LabeledInput
              name="address"
              label="Adresse"
              formControl={form.control}
            />
          </div>

          <Separator className="col-span-4 my-4"/>

          <p className="col-span-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Veranstaltung
          </p>

          <div className="col-span-4 md:col-span-2">
            <Controller
              name="travelMethod"
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="travelMethod">Anreise</FieldLabel>
                  <Select
                    name="travelMethod"
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                  >
                    <SelectTrigger className="w-full max-w-96">
                      <SelectValue placeholder="Bitte wähle"/>
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
              render={({field, fieldState}) => (
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
                      <SelectValue placeholder="Bitte wähle"/>
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
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="accommodation">Unterkunft</FieldLabel>
                  <Select
                    name="accommodation"
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger className="w-full max-w-96">
                      <SelectValue placeholder="Bitte wähle"/>
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
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor="foodChoice">Essenswahl</FieldLabel>
                  <Select
                    name="foodChoice"
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger className="w-full max-w-96">
                      <SelectValue placeholder="Bitte wähle"/>
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
                render={({field, fieldState}) => (
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
                render={({field, fieldState}) => (
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

          <div className="col-span-4 md:col-span-2">
            <Controller
              name={"price"}
              control={form.control}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.error}>
                  <FieldLabel htmlFor={"price"}>Preis</FieldLabel>
                  <MaskInput
                    id={"price"}
                    mask="currency"
                    currency="EUR"
                    locale="de-DE"
                    placeholder="0,00 €"
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(parseFloat(value.slice(0, value.length - 1)))}
                    disabled={!(currentUser?.roles?.at(0) === 'admin')}
                  />
                </Field>
              )}
            />
          </div>

          <Separator className="col-span-4 my-4"/>

          <div className="flex flex-row justify-between w-full col-span-4">
            <Button variant="outline" disabled={saving} onClick={onSave}>
              Speichern
              <Save className="ml-1 h-4 w-4"/>
            </Button>
            {!participant.checkinConfirmed && (
              <DialogTrigger>
                <Button disabled={saving}>
                  Speichern und Einchecken
                  <ArrowRight className="h-4 w-4"/>
                </Button>
              </DialogTrigger>
            )}
          </div>
        </div>

        <AlertCenter className="mt-4"/>
      </Form>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teilnehhmer Einchecken</DialogTitle>
          <DialogDescription>
            Bitte überprüfe noch Folgende Dinge (verpflichtend!)
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              id="ageChecked"
              value={ageChecked}
              onCheckedChange={(value) => setAgeChecked(value as boolean)}
            />
            <Label htmlFor="ageChecked" className="ml-2">
              Ich bestätige, dass das Alter des Teilnehmers korrekt ist und er/sie die Teilnahmebedingungen erfüllt.
            </Label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              id="parentConfirmationChecked"
              value={parentConfirmationChecked}
              onCheckedChange={(value) => setParentConfirmationChecked(value as boolean)}
            />
            <Label htmlFor="parentConfirmationChecked" className="ml-2">
              Ich bestätige, dass ich die Einverständniserklärung der Eltern habe. (nur bei U18 notwendig)
            </Label>
          </div>
          {!participant.acceptPhotos && (
            <div className="flex flex-row items-center gap-2">
              <Controller
                name={"acceptPhotos"}
                control={form.control}
                render={({field, fieldState}) =>
                <>
                  <Checkbox
                  id="acceptPhotos"
                  value={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                  <Label htmlFor="acceptPhotos" className="ml-2">
                    Während dem Treffen werden Fotos und Videos gemacht und Veröffentlicht. Der/die Teilnehmer/Teilnehmerin ist informiert und stimmt zu.
                  </Label>
                </>
              } />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">
              Abbrechen
            </Button>
          </DialogClose>
          <Button onClick={onCheckin} disabled={saving || !ageChecked || !parentConfirmationChecked}>
            Einchecken
            <UserCheck className="h-4 w-4"/>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ParticipantDetailForm
