import { Metadata } from '@redwoodjs/web'
import { Link, useParams } from "@redwoodjs/router";
import {
  CheckboxField,
  DateField,
  FieldError,
  Form,
  InputField,
  Label,
  RadioField,
  SelectField,
  Submit,
  SubmitHandler
} from "@redwoodjs/forms";
import React from 'react'

interface FormValues {
  roleId: number
  name: string
  familyName: string
  birthdate: Date
  gender: string
  email: string
  country: string
  city: string
  postalCode: string
  address: string
  phoneNumber: string
}

const EventPage = () => {
  const { id } = useParams()
  const year = id

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    data.roleId = 3
    console.log(data)
    // create({ variables: { input: data } }).then((r) => console.log)
  }

  const validateDateRange = (value, context) => {
    const startDate = new Date(context.startDate)
    const endDate = new Date(context.endDate)
    const minDate = new Date('2025-07-20')
    const maxDate = new Date('2025-07-25')

    if (startDate < minDate || startDate > maxDate) {
      return 'Start date must be between July 20 and July 25, 2025'
    }
    if (endDate < startDate || endDate > maxDate) {
      return 'End date must be after the start date and no later than July 25, 2025'
    }
    return true
  }

  return (
    <>
      <Metadata title="Event" description="Event page" />

      <code>{id}</code>

      <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
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
        <FieldError name="name" className="error" />

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

        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
          <RadioField
            name="accomodation"
            value="true"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <Label
            name="accomodation"
            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Unterkunft Notwendig
          </Label>
        </div>
        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
          <RadioField
            name="accomodation"
            value="false"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <Label
            name="accomodation"
            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Keine Unterkunft Notwendig
          </Label>
        </div>

        <div
          id="date-range-picker"
          date-rangepicker
          className="flex items-center"
        >
          <div className="relative">
            <DateField
              name="startdate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date start"
              validation={{
                required: { value: true, message: 'Start date is required' },
                validate: validateDateRange,
              }}
            />
            <FieldError name="startDate" />
          </div>
          <span className="mx-4 text-gray-500">to</span>
          <div className="relative">
            <DateField
              name="endDate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date end"
              validation={{
                required: { value: true, message: 'End date is required' },
                validate: validateDateRange,
              }}
            />
            <FieldError name="endDate" />
          </div>
        </div>

        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
          <RadioField
            name="accomodation"
            value="true"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <Label
            name="accomodation"
            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Ich hätte gerne das Menü mit Fleisch
          </Label>
        </div>
        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
          <RadioField
            name="accomodation"
            value="false"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <Label
            name="accomodation"
            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Ich hätte gerne das vegetarische Menü
          </Label>
        </div>

        <div className="flex items-center">
          <CheckboxField
            name="helpAfterwards"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <Label
            name="acceptCoC"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Ich kann beim Abbau der Zelte Mithelfen. (Wir würden uns sehr freuen, wenn du noch ein paar Stunden bleibst und uns beim Abbau hilfst. Und: Es gibt Gratis Mittagessen!)
          </Label>
        </div>

        <div className="flex items-center">
          <CheckboxField
            name="acceptCoC"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <Label
            name="acceptCoC"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Ich habe den{' '}
            <a
              href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              Verhaltenscodex
            </a>{' '}
            gelesen und akzeptiere diesen.
          </Label>
        </div>

        <div className="flex">
          <div className="flex items-center h-5">
            <CheckboxField
              name="acceptPhotos"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="ms-2 text-sm">
            <Label
              name="link-acceptPhotos"
              className="font-medium text-gray-900 dark:text-gray-300"
            >
              Ich stimme zu, fotografiert oder gefilmt werden zu dürfen.
            </Label>
            <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
              Während des gesamten Treffens werden Foto- und Videoaufnahmen gemacht. Ich bin außerdem damit
              einverstanden, dass Bilder von mir in den Kommunikationsmitteln des Jugendtreffens (v.a. für die Homepage)
              und in den Kommunikationsmitteln von ausgewählten Kooperationspartnern im Zusammenhang mit dem
              Jugendtreffen und nach Rücksprache mit dem Jugendtreffen verwendet werden dürfen
            </p>
          </div>

        </div>

        <Submit
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          An Jugendtreffen {year} Teilnehmen
        </Submit>
      </Form>

      {/*
          My default route is named `event`, link to me with:
          `<Link to={routes.event()}>Event</Link>`
      */}
    </>
  )
}

export default EventPage
