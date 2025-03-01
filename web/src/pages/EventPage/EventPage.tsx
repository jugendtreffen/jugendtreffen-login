import { Metadata, type TypedDocumentNode, useMutation } from "@redwoodjs/web";
import { routes, useParams } from "@redwoodjs/router";
import {
  CheckboxField,
  DateField,
  FieldError,
  Form, FormError,
  Label,
  RadioField,
  SelectField,
  Submit,
  SubmitHandler
} from "@redwoodjs/forms";
import { toast, Toaster} from '@redwoodjs/web/toast'
import React, { useState } from "react";
import {
  CreateParticipationMutation,
  CreateParticipationMutationVariables,
  type EventsQuery,
  type EventsQueryVariables
} from "types/graphql";
import Card from "src/components/Card/Card";

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
`;

const FIND_EVENT: TypedDocumentNode<EventsQuery, EventsQueryVariables> = gql`
  query FindEvent($id: Int!) {
    event(id: $id) {
      id,
      name,
      desc,
      startDate,
      endDate,
    }
  }
`;

interface FormValues {
  eventId: number;
  travelMethod: string;
  participationRoleId: number;
  accommodation: boolean;
  startDate: Date;
  endDate: Date;
  foodChoice: string;
  acceptCoC: boolean;
  helpAfterwards: boolean;
  acceptPhotos: boolean;
  foundUsBy: string;
}

const EventPage = () => {
  const { id } = useParams();
  const [completed, setCompleted] = useState(false)
  const [create, {
    loading,
    error
  }] = useMutation<CreateParticipationMutation, CreateParticipationMutationVariables>(CREATE_PARTICIPATION, {onCompleted: () => {toast.success('Deine Teilnahme wurde gespeichert'); setCompleted(true)}});

  const minDate = new Date("2025-07-20");
  const maxDate = new Date("2025-07-25");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    data.eventId = 0;
    data.foundUsBy = ""; // noch Feld erstellen
    data.participationRoleId = parseInt(String(data.participationRoleId), 10);
    data.accommodation = String(data.accommodation) == "true";
    console.log(data);
    // @ts-ignore
    create({ variables: { input: data } }).then((r) => console.log);
  };

  const validateStartDate = (value, context) => {
    if (context.startDate < minDate || context.startDate > maxDate) {
      return "Jugendtreffen findet zwischen 20.Juli 2025 und 25.Juli 2025 statt";
    }
    return true;
  };

  const validateEndDate = (value, context) => {
    if (context.endDate < context.startDate) {
      return "Du kannst nicht vor deiner Ankunft abreisen";
    }
    if (context.endDate > maxDate) {
      return "Das Jugendtreffen endet am 25.Juli 2025";
    }
    return true;
  };

  if(completed) {
    return (
      <>
        <Metadata title="Teilnahme erfolgreich" description="Event page" />

        <Card
          title="Alles erledigt!"
          description="Du bist für event.name angemeldet!"
          button={{message: 'zu meinen Events', to: routes.home()}}
        >
        </Card>
      </>
    )
  }

  return (
    <>
      <Metadata title="Teilnahme event.name" description="Event page" />

      <Toaster ></Toaster>
      <div className="py-6">
        <h1 className="mb-4 w-full text-center">{id}</h1>
        <div className="flex flex-row justify-end gap-2 text-gray-300">
          <span className="text-blue-500 font-bold">*</span>
          <span>Pflichtfelder</span>
        </div>
        <Form onSubmit={onSubmit} config={{ mode: "onBlur" }} error={error} className="flex flex-col gap-4 max-w-lg">
          <div>
            <Label name="travelMethod" errorClassName="error">
              Anreise<span className="font-bold text-blue-500">*</span>
            </Label>
            <SelectField
              name="travelMethod"
              validation={{ required: { value: true, message: "Irgendwie musst du nach Kremsmünster finden..." } }}
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
              Ich nehme Teil als<span className="font-bold text-blue-500">*</span>
            </Label>
            <SelectField
              name="participationRoleId"
              validation={{
                required: {
                  value: true,
                  message: "Wähle wie du deine Zeit am Jugendtreffen verbringen wirst"
                }
              }}
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
            <FieldError name="participationRoleId" className="error ms-2" />
          </div>

          <div>
            <div className="label">Ich brauche...<span className="font-bold text-blue-500">*</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                <RadioField
                  id="yes-acc"
                  name="accommodation"
                  errorClassName="error"
                  validation={{ required: { value: true, message: "Wähle aus wo du übernachten wirst" } }}
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
                  errorClassName="error"
                  validation={{ required: { value: true, message: "Wähle aus wo du übernachten wirst" } }}
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
            <FieldError name="accommodation" className="error ms-2" />
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
                  required: { value: true, message: "Wann kommst du?" },
                  validate: validateStartDate
                }}
              />
              <FieldError name="startDate" className="error ms-2" />
            </div>
            <span className="mx-4 text-gray-500">to</span>
            <div className="relative">
              <DateField
                name="endDate"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                errorClassName="error"
                validation={{
                  required: { value: true, message: "Wann fährtst du heim?" },
                  validate: validateEndDate
                }}
              />
              <FieldError name="endDate" className="error ms-2" />
            </div>
          </div>

          <div>
            <div className="label">Ich esse...<span className="font-bold text-blue-500">*</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                <RadioField
                  id="alles"
                  name="foodChoice"
                  value="alles"
                  errorClassName="error"
                  validation={{ required: { value: true, message: "Wähle aus was du essen magst" } }}
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
                  errorClassName="error"
                  validation={{ required: { value: true, message: "Wähle aus was du essen magst" } }}
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
            <FieldError name="foodChoice" className="error ms-2" />
          </div>

          <div>
            <div className="flex items-center">
              <CheckboxField
                name="acceptCoC"
                errorClassName="error"
                validation={{ required: { value: true, message: "Akzeptiere den Verhaltenscodex um teilzunehmen!" } }}
              />
              <Label
                name="acceptCoC"
                className="ms-2"
              >
                Ich habe den{" "}
                <a
                  href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
                  className="link"
                >
                  Verhaltenscodex
                </a>{" "}
                gelesen und akzeptiere diesen.<span className="font-bold text-blue-500">*</span>
              </Label>
            </div>
            <FieldError name="acceptCoC" className="ms-6 error"></FieldError>
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
                Wir würden uns sehr freuen, wenn du noch ein paar Stunden bleibst und uns beim Abbau hilfst. Und: Es
                gibt Gratis Mittagessen!
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
                einverstanden, dass Bilder von mir in den Kommunikationsmitteln des Jugendtreffens (v.a. für die
                Homepage)
                und in den Kommunikationsmitteln von ausgewählten Kooperationspartnern im Zusammenhang mit dem
                Jugendtreffen und nach Rücksprache mit dem Jugendtreffen verwendet werden dürfen
              </p>
            </div>
          </div>

          <Submit
            className="primary w-fit"
            disabled={loading}
          >
            An "event.name" Teilnehmen
          </Submit>
          <FormError  error={error} wrapperClassName="form-error"/>
        </Form>
      </div>
    </>
  );
};

export default EventPage;
