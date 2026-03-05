import EventRegistrationForm from '@/components/EventRegistrationForm/EventRegistrationForm'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckboxField,
  DateField,
  FieldError,
  InputField,
  Label,
  RadioField,
  SelectField,
  SubmitHandler,
  useForm,
} from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { useAlert } from 'src/components/Alert/AlertContext'
import CurrentEventCell from 'src/components/CurrentEventCell'
import MultiStepForm from 'src/components/MultiStepForm/MultiStepForm'
import Step from 'src/components/MultiStepForm/Step'
import { CreateParticipantMutation, CreateParticipantMutationVariables, } from 'types/graphql'
import EventRegistrationCell from '../components/EventRegistrationCell/EventRegistrationCell'

const CREATE_REGISTEREDPARTICIPANT = gql`
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

interface FormValues {
  name: string
  familyName: string
  birthdate: string
  gender: string
  phoneNumber: string
  phoneCaretakerContact: string
  foundUsBy: string
  isParent: Boolean
  country: string
  city: string
  postalCode: string
  address: string
  travelMethod: string
  accommodation: string
  startDate: string
  endDate: string
  foodChoice: string
  acceptPhotos: boolean
  acceptCoC: boolean
  eventId: number
  participationRole: string
}

const EventRegistrationPage = () => {
  const { addAlert, removeAllAlerts } = useAlert()
  const [isMinor, setMinor] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [accomodationCheck, setAccomodationCheck] = useState({
    role: undefined,
    accommodation: undefined,
  })
  const [hasOpenedLink, setHasOpenedLink] = useState(false)
  const formMethods = useForm({
    mode: 'onBlur',
    resolver: null,
  })

  //TODO: dynamically get startdate, enddate and currenteventid
  const START_DATE = '2025-07-15'
  const END_DATE = '2025-07-20'
  const currentEventId = 6

  CurrentEventCell

  const [createRegisteredParticipant, { loading, error }] = useMutation<
    CreateParticipantMutation,
    CreateParticipantMutationVariables
  >(CREATE_REGISTEREDPARTICIPANT, {
    onCompleted: (data) => {
      toast.success('Deine Teilnahme wurde gespeichert')
      setCompleted(true)
      formMethods.reset()
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
    console.log(typeof input.startDate, input.startDate)
    removeAllAlerts()
    input.eventId = currentEventId
    input.accommodation = String(input.accommodation)
    //input.birthdate = new Date(input.birthdate).toISOString().slice(0, 10)
    //input.startDate = new Date(input.startDate).toISOString().slice(0, 10)
    //input.endDate = new Date(input.endDate).toISOString().slice(0, 10)
    await createRegisteredParticipant({
      variables: {
        input: {
          name: input.name,
          familyName: input.familyName,
          birthdate: input.birthdate,
          gender: input.gender,
          phoneNumber: input.phoneNumber,
          phoneCaretakerContact: input.phoneCaretakerContact,
          foundUsBy: input.foundUsBy,
          isParent: Boolean(input.isParent),
          country: input.country,
          city: input.city,
          postalCode: input.postalCode,
          address: input.address,
          travelMethod: input.travelMethod,
          accommodation: input.accommodation,
          startDate: input.startDate,
          endDate: input.endDate,
          foodChoice: input.foodChoice,
          acceptPhotos: input.acceptPhotos,
          acceptCoC: input.acceptCoC,
          eventId: input.eventId,
          participationRole: input.participationRole,
        },
      },
    })
  }

  const validateBirthDate = (value: string) => {
    const birthdate = new Date(value)

    const max_bd = new Date(new Date().getFullYear() - 13, 7, 31)
    const minor_bd = new Date(new Date().getFullYear() - 18, 7, 31)

    if (birthdate >= minor_bd) {
      setMinor(true)
    } else {
      setMinor(false)
    }
    if (birthdate >= max_bd) {
      return 'Teilnehmende müssen mindestens 14 Jahre alt sein oder in diesem Schuljahr (2024/25) die 8. Schulstufe besucht haben. Stichtag ist der 31.08.2011. Eine Teilnahme ist bis zum 30. Lebensjahr möglich.'
    }
  }

  const validateStartDate = (value, context) => {
    const start = new Date(value)
    const min = new Date(START_DATE)
    const max = new Date(END_DATE)

    if (start < min || start > max) {
      return 'Jugendtreffen findet zwischen 15. Juli 2025 und 20. Juli 2025 statt'
    }

    return true
  }

  const validateEndDate = (value, context) => {
    const end = new Date(value)
    const start = new Date(context.startDate)
    const max = new Date(END_DATE)

    if (end < start) {
      return 'Du kannst nicht vor deiner Ankunft abreisen'
    }

    if (end > max) {
      return 'Das Jugendtreffen endet am 20. Juli 2025'
    }

    return true
  }

  const shouldDisplayAccomodationLocation = () => {
    return (
      (accomodationCheck.role == 'Ordensmann/Ordensfrau' ||
        accomodationCheck.role == 'Vortragender' ||
        accomodationCheck.role == 'Begleitperson' ||
        accomodationCheck.role == 'Priester') &&
      accomodationCheck.accommodation
    )
  }

  return (
    <>
      <Metadata title="Jugendtreffen-Anmeldung" />

      <Card>
        <h1>Anmeldung Jugendtreffen</h1>
        <CurrentEventCell variant="date" />
        <MultiStepForm
          className="space-y-4 md:space-y-6"
          finishText="Anmelden"
          onSubmit={onSubmit}
          disableSubmit={null}
          formMethods={formMethods}
        >
          <Step>
            <p className="secondary text-end">Schritt: 1/2</p>
            <InputField
              name="name"
              placeholder="Vorname"
              validation={{ required: true }}
              errorClassName="error"
            />
            <InputField
              name="familyName"
              placeholder="Familienname"
              validation={{ required: true }}
              errorClassName="error"
            />
            <div>
              <Label name={'birthdate'} errorClassName={'error'}>
                Geburtsdatum
              </Label>
              <DateField
                name={'birthdate'}
                max={new Date().toISOString().slice(0, 10)}
                validation={{
                  required: {
                    value: true,
                    message: 'Bitte gebe dein Geburtsdatum an',
                  },
                  validate: validateBirthDate,
                }}
                errorClassName="error"
              />
              <FieldError name={'birthdate'} className={'error'} />
            </div>
            <div>
              <Label name={'phoneNumber'} errorClassName={'error'}>
                Handynummer
              </Label>
              <InputField
                name={'phoneNumber'}
                validation={{ required: true }}
                placeholder="+43 1234 12345678 "
                errorClassName={'error'}
              ></InputField>
            </div>
            <div>
              <Label name={'phoneCaretakerContact'} errorClassName={'error'}>
                Handynummer deines Erziehungsberechtigten
                <p className="secondary">für unter 18 verpflichtend</p>
              </Label>
              <InputField
                name={'phoneCaretakerContact'}
                validation={{ required: isMinor }}
                placeholder="+43 1234 12345678 "
                errorClassName={'error'}
              ></InputField>
            </div>
            <div>
              <Label name={'gender'} errorClassName={'error'}>
                Geschlecht
              </Label>
              <SelectField
                name={'gender'}
                validation={{ required: true }}
                errorClassName={'error'}
              >
                <option value="" disabled selected={true}>
                  Bitte wählen Sie
                </option>
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
              </SelectField>
            </div>
            <div className="mt-4">
              <Label name="country" errorClassName="error">
                Woher kommst du?
              </Label>
              <SelectField
                name="country"
                validation={{ required: true }}
                errorClassName="error"
              >
                <option value="" disabled selected={true}>
                  Bitte wählen Sie
                </option>
                <option value="AT">Österreich</option>
                <option value="DE">Deutschland</option>
                <option value="IT">Italien</option>
                <option value="FR">Frankreich</option>
                <option value="HU">Ungarn</option>
                <option value="CH">Schweiz</option>
                <option value="LU">Luxemburg</option>
                <option value="--">Anderes</option>
              </SelectField>
            </div>

            <div className="flex flex-row gap-4">
              <InputField
                className="w-1/4"
                name="postalCode"
                validation={{ required: true }}
                errorClassName="error w-1/4"
                placeholder="PLZ"
              />
              <InputField
                className="w-3/4"
                name="city"
                validation={{ required: true }}
                errorClassName="error w-3/4"
                placeholder="Stadt"
              />
            </div>

            <InputField
              name="address"
              validation={{ required: true }}
              errorClassName="error"
              placeholder="Straße, Hausnummer"
            />
          </Step>
          <Step>
            <p className="secondary text-end">Schritt: 2/2</p>
            {loading ? (
              <>
                <Skeleton className="w-full h-2" />
                <Skeleton className="w-full h-2" />
                <Skeleton className="w-full h-2" />
              </>
            ) : (
              <>
                <></>
                <div>
                  <Label name="travelMethod" errorClassName="error">
                    Anreise<span className="font-bold text-primary-500">*</span>
                  </Label>
                  <SelectField
                    name="travelMethod"
                    validation={{
                      required: {
                        value: true,
                        message:
                          'Irgendwie musst du nach Kremsmünster finden...',
                      },
                    }}
                    errorClassName="error"
                  >
                    <option value="" disabled selected={true}>
                      Bitte wählen Sie
                    </option>
                    <option value="auto">mit dem Auto</option>
                    <option value="zug">mit dem Zug</option>
                  </SelectField>
                  <FieldError name="travelMethod" className="error ms-2" />
                </div>
                <div>
                  <Label name="participationRoleId" errorClassName="error">
                    Ich nehme Teil als
                    <span className="font-bold text-primary-500">*</span>
                  </Label>
                  <SelectField
                    name="participationRoleId"
                    validation={{
                      required: {
                        value: true,
                        message:
                          'Wähle wie du deine Zeit am Jugendtreffen verbringen wirst',
                      },
                    }}
                    onChange={(value) => {
                      setAccomodationCheck({
                        role: value.target.value,
                        accommodation: accomodationCheck.accommodation,
                      })
                    }}
                    errorClassName="error"
                  >
                    <option value="" disabled selected={true}>
                      Bitte wählen Sie
                    </option>
                    <option value="Teilnehmer">Teilnehmer</option>
                    <option value="Priester">Priester</option>
                    <option value="Begleitperson">Begleitperson</option>
                    <option value="Vortragender">Vortragender</option>
                    <option value="Ordensmann/Ordensfrau">
                      Ordensmann/Ordensfrau
                    </option>
                  </SelectField>
                  <FieldError
                    name="participationRoleId"
                    className="error ms-2"
                  />
                </div>
                <div>
                  <div className="label">
                    Ich brauche...
                    <span className="font-bold text-primary-500">*</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center ps-4 rounded border border-gray-700">
                      <RadioField
                        id="yes-acc"
                        name="accommodation"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus wo du übernachten wirst',
                          },
                        }}
                        value="true"
                        onChange={() =>
                          setAccomodationCheck({
                            role: accomodationCheck.role,
                            accommodation: true,
                          })
                        }
                      />
                      <Label
                        name="accommodation"
                        htmlFor="yes-acc"
                        className="w-full py-3 text-sm mb-0"
                      >
                        eine Unterkunft
                      </Label>
                    </div>
                    <div className="flex items-center ps-4 rounded border border-gray-700">
                      <RadioField
                        id="no-acc"
                        name="accommodation"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus wo du übernachten wirst',
                          },
                        }}
                        value="false"
                        onChange={() =>
                          setAccomodationCheck({
                            role: accomodationCheck.role,
                            accommodation: false,
                          })
                        }
                      />
                      <Label
                        name="accommodation"
                        htmlFor="no-acc"
                        className="w-full py-3 text-sm mb-0"
                      >
                        keine Unterkunft
                      </Label>
                    </div>
                  </div>

                  {shouldDisplayAccomodationLocation() && (
                    <>
                      <div className="label mt-2">Im...</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center ps-4 rounded border border-gray-700">
                          <RadioField
                            id="subiaco"
                            name="accommodationLocation"
                            errorClassName="error"
                            validation={{
                              required: {
                                value: true,
                                message: 'Wähle aus wo du übernachten wirst',
                              },
                            }}
                            value="subiaco"
                          />
                          <Label
                            name="acccommodationLocation"
                            htmlFor="yes-acc"
                            className="w-full py-3 text-sm mb-0"
                          >
                            Haus Subiaco
                            <p className="secondary font-light">
                              Unterbringung im Haus Subiaco
                              <br />
                              Einzelzimmer, Bad am Gang 30€ / Nacht
                            </p>
                          </Label>
                        </div>
                        <div className="flex items-center ps-4 rounded border border-gray-700">
                          <RadioField
                            id="privatquartier"
                            name="accommodationLocation"
                            errorClassName="error"
                            validation={{
                              required: {
                                value: true,
                                message: 'Wähle aus wo du übernachten wirst',
                              },
                            }}
                            value="privatquartier"
                          />
                          <Label
                            name="accomodationLocation"
                            htmlFor="no-acc"
                            className="w-full py-3 text-sm mb-0"
                          >
                            Privatquartier
                            <p className="secondary font-light">
                              Unterbringung bei Familie in Umgebung von
                              Kremsmünster Kann bis zu 20 km entfernt sein (Auto
                              benötigt).
                              <br />
                              Vergabe näherer Quartiere nach Bedarf. kostenfrei
                            </p>
                          </Label>
                        </div>
                      </div>
                    </>
                  )}

                  <FieldError name="accommodation" className="error ms-2" />
                </div>
                <div>
                  <div className="label">
                    Ich bin anwesend von...
                    <span className="font-bold text-primary-500">*</span>
                  </div>

                  <div
                    id="date-range-picker"
                    className="flex items-center flex-wrap gap-2"
                  >
                    <div className="relative">
                      <DateField
                        name="startDate"
                        className="border text-sm rounded-lg block w-full ps-5 p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        errorClassName="error"
                        validation={{
                          required: { value: true, message: 'Wann kommst du?' },
                          validate: validateStartDate,
                        }}
                        defaultValue={START_DATE}
                      />
                      <FieldError name="startDate" className="error ms-2" />
                    </div>
                    <span>bis</span>
                    <div className="relative">
                      <DateField
                        name="endDate"
                        className="border text-sm rounded-lg block w-full ps-5 p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wann fährtst du heim?',
                          },
                          validate: validateEndDate,
                        }}
                        defaultValue={END_DATE}
                      />
                      <FieldError name="endDate" className="error ms-2" />
                    </div>
                  </div>
                  <p className={'secondary mt-2'}>
                    Jugendtreffen findet von {START_DATE} bis {END_DATE} statt
                  </p>
                </div>
                <div>
                  <div className="label">
                    Ich esse...
                    <span className="font-bold text-primary-500">*</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center ps-4 border rounded border-gray-700">
                      <RadioField
                        id="alles"
                        name="foodChoice"
                        value="alles"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus was du essen magst',
                          },
                        }}
                      />
                      <Label
                        name="foodChoice"
                        htmlFor="alles"
                        className="w-full py-3 text-sm mb-0"
                      >
                        eigentlich alles
                      </Label>
                    </div>
                    <div className="flex items-center ps-4 border rounded border-gray-700">
                      <RadioField
                        id="veggi"
                        name="foodChoice"
                        value="vegetarisch"
                        errorClassName="error"
                        validation={{
                          required: {
                            value: true,
                            message: 'Wähle aus was du essen magst',
                          },
                        }}
                      />
                      <Label
                        htmlFor="veggi"
                        name="foodChoice"
                        className="w-full py-3 text-sm mb-0"
                      >
                        nur vegetarisch
                      </Label>
                    </div>
                  </div>
                  <FieldError name="foodChoice" className="error ms-2" />
                </div>
                <div>
                  <div className="flex items-center">
                    <CheckboxField
                      name="acceptCoC"
                      errorClassName="error"
                      validation={{
                        required: {
                          value: true,
                          message:
                            'Akzeptiere den Verhaltenscodex um teilzunehmen!',
                        },
                        valueAsBoolean: true,
                      }}
                      disabled={!hasOpenedLink}
                    />
                    <Label name="acceptCoC" className="ms-2">
                      Ich habe den{' '}
                      <a
                        onClick={() => setHasOpenedLink(true)}
                        href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link text-accent inline-flex"
                      >
                        Verhaltenscodex
                        <Info />
                      </a>{' '}
                      gelesen und akzeptiere diesen.
                      <span className="font-bold text-primary-500">*</span>
                    </Label>
                  </div>
                  <FieldError
                    name="acceptCoC"
                    className="ms-6 error"
                  ></FieldError>
                </div>
                <div className="flex">
                  <div className="flex items-center h-5">
                    <CheckboxField
                      name="acceptPhotos"
                      validation={{
                        required: true,
                        valueAsBoolean: true,
                      }}
                      errorClassName="error"
                    />
                  </div>
                  <div>
                    <Label name="acceptPhotos">
                      Ich stimme zu, fotografiert oder gefilmt werden zu dürfen.
                      <span className="font-bold text-primary-500">*</span>
                    </Label>
                    <p className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-300">
                      Während des gesamten Treffens werden Foto- und
                      Videoaufnahmen gemacht. Ich bin außerdem damit
                      einverstanden, dass Bilder von mir in den
                      Kommunikationsmitteln des Jugendtreffens (v.a. für die
                      Homepage) und in den Kommunikationsmitteln von
                      ausgewählten Kooperationspartnern im Zusammenhang mit dem
                      Jugendtreffen und nach Rücksprache mit dem Jugendtreffen
                      verwendet werden dürfen
                    </p>
                  </div>
                </div>
              </>
            )}
          </Step>
        </MultiStepForm>
      </Card>

      <EventRegistrationForm
        event={{
          id: 6,
          name: 'Jugendtreffen 2026',
          desc: 'description',
          startDate: new Date('2026-07-15'),
          endDate: new Date('2026-07-21'),
        }}
      ></EventRegistrationForm>

      <EventRegistrationCell></EventRegistrationCell>
    </>
  )
}

export default EventRegistrationPage
