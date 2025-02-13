import { Metadata, type TypedDocumentNode, useMutation } from "@redwoodjs/web";
import { useParams } from "@redwoodjs/router";
import {
  CheckboxField,
  DateField,
  FieldError,
  Form,
  Label,
  RadioField,
  SelectField,
  Submit,
  SubmitHandler
} from "@redwoodjs/forms";
import React from 'react'
import {
  CreateParticipationMutation,
  CreateParticipationMutationVariables,
  type EventsQuery,
  type EventsQueryVariables
} from "types/graphql";

const CREATE_PARTICIPATION = gql`
  mutation CreateParticipationMutation($input: CreateParticipationInput!) {
    createParticipation(input: $input) {
      travelMethod,
      participationRoleId,
      accommodation,
      startDate,
      endDate,
      foodChoice,
      helpAfterwards,
      foundUsBy,
      acceptPhotos,
      acceptCoC,
      eventId,
    }
  }
`

const QUERY_EVENT: TypedDocumentNode<EventsQuery, EventsQueryVariables> = gql`
  query getEvent($id: Int!) {
    event(id: $id) {
      id,
      name,
      desc
    }
  }
`

interface FormValues {
  eventId: number
  travelMethod: string
  participationRoleId: number
  accommodation: boolean
  startDate: Date
  endDate: Date
  foodChoice: string
  acceptCoC: boolean
  helpAfterwards: boolean
  acceptPhotos: boolean
  foundUsBy: string
}

const EventPage = () => {
  const { id } = useParams()
  const [create] = useMutation<CreateParticipationMutation, CreateParticipationMutationVariables>(CREATE_PARTICIPATION)

  const minDate = new Date('2025-07-20')
  const maxDate = new Date('2025-07-25')

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    data.eventId = 0
    data.foundUsBy = "" // noch Feld erstellen
    data.participationRoleId = parseInt(String(data.participationRoleId), 10)
    data.accommodation = String(data.accommodation) == "true"
    console.log(data)
    create({ variables: { input: data } }).then((r) => console.log)
  }

  const validateStartDate = (value, context) => {
    if (context.startDate < minDate || context.startDate > maxDate) {
      return 'Jugendtreffen findet zwischen 20.Juli 2025 und 25.Juli 2025 statt'
    }
    return true
  }

  const validateEndDate = (value, context) => {
    if (context.endDate < context.startDate) {
      return 'Du kannst nicht vor deiner Ankunft abreisen'
    }
    if (context.endDate > maxDate) {
      return 'Das Jugendtreffen endet am 25.Juli 2025'
    }
    return true
  }

  return (
    <>
      <Metadata title="Event" description="Event page" />

      <div className="py-6">
      <h1 className="mb-4 w-full text-center">{id}</h1>

      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }} className="flex flex-col gap-4 max-w-lg">
        <div>
          <Label name="travelMethod" errorClassName="error">
            Anreise
          </Label>
          <SelectField
            name="travelMethod"
            validation={{ required: true }}
            errorClassName="error"
          >
            <option value="" disabled selected={true}>
              Bitte wählen Sie
            </option>
            <option value="auto">mit dem Auto</option>
            <option value="zug">mit dem Zug</option>
            <option value="jungfamilientreffen">
              bin schon beim Jungfamilientreffen da
            </option>
          </SelectField>
          <FieldError name="travelMethod" className="error" />
        </div>

        <div>
          <Label name="participationRoleId" errorClassName="error">
            Ich nehme Teil als
          </Label>
          <SelectField
            name="participationRoleId"
            validation={{ required: true }}
            errorClassName="error"
          >
            <option value="" disabled selected={true}>
              Bitte wählen Sie
            </option>
            <option value="0">Teilnehmer</option>
            <option value="1">Ordensmann/Priester</option>
            <option value="2">Mitarbeiter</option>
            <option value="3">Begleitperson</option>
            <option value="4">Vortragender</option>
          </SelectField>
          <FieldError name="participationRoleId" className="error" />
        </div>

        <div>
          <div className="label">Ich brauche...</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <RadioField
                id="yes-acc"
                name="accommodation"
                value="true"
              />
              <Label
                name="accommodation"
                htmlFor="yes-acc"
                className="w-full py-3 text-sm"
              >
                eine Unterkunft
              </Label>
            </div>
            <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <RadioField
                id="no-acc"
                name="accommodation"
                value="false"
              />
              <Label
                name="accommodation"
                htmlFor="no-acc"
                className="w-full py-3 text-sm"
              >
                keine Unterkunft
              </Label>
            </div>
          </div>
        </div>

        <div
          id="date-range-picker"
          date-rangepicker
          className="flex items-center"
        >
          <div className="relative">
            <DateField
              name="startDate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              errorClassName="error"
              validation={{
                required: { value: true, message: 'Start date is required' },
                validate: validateStartDate,
              }}
            />
            <FieldError name="startDate" />
          </div>
          <span className="mx-4 text-gray-500">to</span>
          <div className="relative">
            <DateField
              name="endDate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              errorClassName="error"
              validation={{
                required: { value: true, message: 'End date is required' },
                validate: validateEndDate,
              }}
            />
            <FieldError name="endDate" />
          </div>
        </div>

        <div>
          <div className="label">Ich esse...</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <RadioField
                id="alles"
                name="foodChoice"
                value="alles"
              />
              <Label
                name="foodChoice"
                htmlFor="alles"
                className="w-full py-3 text-sm"
              >
                eigentlich alles
              </Label>
            </div>
            <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
              <RadioField
                id="veggi"
                name="foodChoice"
                value="vegetarisch"
              />
              <Label
                htmlFor="veggi"
                name="foodChoice"
                className="w-full py-3 text-sm"
              >
                nur vegetarisch
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <CheckboxField
            name="acceptCoC"
          />
          <Label
            name="acceptCoC"
            className="ms-2"
          >
            Ich habe den{' '}
            <a
              href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
              className="link"
            >
              Verhaltenscodex
            </a>{' '}
            gelesen und akzeptiere diesen.
          </Label>
        </div>

        <div className="flex">
          <div className="flex items-center h-5">
            <CheckboxField
              name="helpAfterwards"
            />
          </div>
          <div>
            <Label
              name="helpAfterwards"
            >
              Ich kann beim Abbau der Zelte Mithelfen.
            </Label>
            <p className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-300">
              Wir würden uns sehr freuen, wenn du noch ein paar Stunden bleibst und uns beim Abbau hilfst. Und: Es gibt Gratis Mittagessen!
            </p>
          </div>
        </div>

        <div className="flex">
          <div className="flex items-center h-5">
            <CheckboxField
              name="acceptPhotos"
            />
          </div>
          <div>
            <Label
              name="acceptPhotos"
            >
              Ich stimme zu, fotografiert oder gefilmt werden zu dürfen.
            </Label>
            <p className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-300">
              Während des gesamten Treffens werden Foto- und Videoaufnahmen gemacht. Ich bin außerdem damit
              einverstanden, dass Bilder von mir in den Kommunikationsmitteln des Jugendtreffens (v.a. für die Homepage)
              und in den Kommunikationsmitteln von ausgewählten Kooperationspartnern im Zusammenhang mit dem
              Jugendtreffen und nach Rücksprache mit dem Jugendtreffen verwendet werden dürfen
            </p>
          </div>
        </div>

        <Submit
          className="primary w-fit">
          An "event.name" Teilnehmen
        </Submit>
      </Form>
      </div>
    </>
  )
}

export default EventPage
