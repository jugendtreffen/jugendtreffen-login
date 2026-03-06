import { SubmitHandler, useForm } from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useState } from 'react'
import { useAlert } from 'src/components/Alert/AlertContext'
import CurrentEventCell from 'src/components/CurrentEventCell'
import {
  CreateParticipantMutation,
  CreateParticipantMutationVariables,
} from 'types/graphql'

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

      <div className="h-24"></div>

      <div className="flex justify-center mb-4">
        <CurrentEventCell />
      </div>
    </>
  )
}

export default EventRegistrationPage
