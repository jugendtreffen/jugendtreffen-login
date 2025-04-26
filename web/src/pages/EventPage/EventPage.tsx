import { Metadata, useMutation } from "@redwoodjs/web";
import { navigate, routes, useParams } from "@redwoodjs/router";
import {
  CheckboxField,
  DateField,
  FieldError,
  Form,
  FormError,
  Label,
  RadioField,
  SelectField,
  Submit,
  SubmitHandler,
  useForm
} from "@redwoodjs/forms";
import { toast, Toaster } from "@redwoodjs/web/toast";
import React, { useState } from "react";
import { CreateParticipationMutation, CreateParticipationMutationVariables } from "types/graphql";
import Card from "src/components/Card/Card";
import EventCell from "src/components/EventCell/EventCell";
import { useAuth } from "src/auth";
import { InfoIcon } from "src/components/Icons/Icons";

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

interface FormValues {
  eventId: number;
  travelMethod: string;
  participationRoleId: number;
  accommodation: boolean;
  accommodationLocation: string;
  startDate: Date;
  endDate: Date;
  foodChoice: string;
  acceptCoC: boolean;
  helpAfterwards: boolean;
  acceptPhotos: boolean;
  userId: string;
}

const EventPage = () => {
  const { id } = useParams();
  const [completed, setCompleted] = useState(false);
  const [accomodationCheck, setAccomodationCheck] = useState({ role: undefined, accommodation: undefined });
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const { isAuthenticated, userMetadata } = useAuth();
  const formMethods = useForm();
  const [create, {
    loading,
    error
  }] = useMutation<CreateParticipationMutation, CreateParticipationMutationVariables>(CREATE_PARTICIPATION, {
    onCompleted: () => {
      toast.success("Deine Teilnahme wurde gespeichert");
      setCompleted(true);
    }
  });

  const startDate = new Date("2025-07-15");
  const endDate = new Date("2025-07-20");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    data.eventId = parseInt(id, 10);
    data.participationRoleId = parseInt(String(data.participationRoleId), 10);
    data.accommodation = String(data.accommodation) == "true";
    data.userId = userMetadata.sub;
    // @ts-ignore
    await create({ variables: { input: data } });
  };

  const validateStartDate = (value, context) => {
    if (context.startDate < startDate || context.startDate > endDate) {
      return "Jugendtreffen findet zwischen 15.Juli 2025 und 20.Juli 2025 statt";
    }
    return true;
  };

  const validateEndDate = (value, context) => {
    if (context.endDate < context.startDate) {
      return "Du kannst nicht vor deiner Ankunft abreisen";
    }
    if (context.endDate > endDate) {
      return "Das Jugendtreffen endet am 20.Juli 2025";
    }
    return true;
  };

  const shouldDisplayAccomodationLocation = () => {
    return ((accomodationCheck.role == 1 || accomodationCheck.role == 4 || accomodationCheck.role == 5) && accomodationCheck.accommodation);
  };

  if (!isAuthenticated) {
    navigate(routes.login({ next: routes.events({ id: id }) }));
  }

  if (completed) {
    return (
      <>
        <Metadata title="Teilnahme erfolgreich" description="Event page" />

        <Toaster></Toaster>
        <Card
          title="Alles erledigt!"
          description="Du bist für das Jugendtreffen angemeldet!"
          button={{ message: "zu meinen Events", to: routes.home() }}
        >
        </Card>
      </>
    );
  }

  return (
    <>
      <Metadata title="Teilnahme Jugendtreffen" description="Teilnahme Jugendtreffen" />

      <Toaster></Toaster>
      <EventCell id={parseInt(id, 10)} />
      <div className="mx-auto mt-6">
        <div className="flex flex-row justify-end gap-1 text-gray-300">
          <span className="text-primary-500 font-bold">*</span>
          <span>Pflichtfelder</span>
          <p className="secondary text-end ms-6">Schritt: 4/4</p>
        </div>
        <Form onSubmit={onSubmit} config={{ mode: "onBlur" }} error={error} formMethods={formMethods}
              className="flex flex-col gap-5 max-w-xl">
          <div>
            <Label name="travelMethod" errorClassName="error">
              Anreise<span className="font-bold text-primary-500">*</span>
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
              Ich nehme Teil als<span className="font-bold text-primary-500">*</span>
            </Label>
            <SelectField
              name="participationRoleId"
              validation={{
                required: {
                  value: true,
                  message: "Wähle wie du deine Zeit am Jugendtreffen verbringen wirst"
                }
              }}
              onChange={(value) => {
                setAccomodationCheck({ role: value.target.value, accommodation: accomodationCheck.accommodation });
              }}
              errorClassName="error"
            >
              <option value="" disabled selected={true}>
                Bitte wählen Sie
              </option>
              <option value="0">Teilnehmer</option>
              <option value="1">Priester</option>
              <option value="2">Mitarbeiter</option>
              <option value="3">Begleitperson</option>
              <option value="4">Vortragender</option>
              <option value="5">Ordensmann/Ordensfrau</option>
            </SelectField>
            <FieldError name="participationRoleId" className="error ms-2" />
          </div>

          <div>
            <div className="label">Ich brauche...<span className="font-bold text-primary-500">*</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center ps-4 rounded border dark:border-gray-700">
                <RadioField
                  id="yes-acc"
                  name="accommodation"
                  errorClassName="error"
                  validation={{ required: { value: true, message: "Wähle aus wo du übernachten wirst" } }}
                  value="true"
                  onChange={() => setAccomodationCheck({ role: accomodationCheck.role, accommodation: true })}
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
                  validation={{ required: { value: true, message: "Wähle aus wo du übernachten wirst" } }}
                  value="false"
                  onChange={() => setAccomodationCheck({ role: accomodationCheck.role, accommodation: false })}
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
                  <div className="flex items-center ps-4 rounded border dark:border-gray-700">
                    <RadioField
                      id="subiaco"
                      name="accommodationLocation"
                      errorClassName="error"
                      validation={{ required: { value: true, message: "Wähle aus wo du übernachten wirst" } }}
                      value="subiaco"
                    />
                    <Label
                      name="acccommodationLocation"
                      htmlFor="yes-acc"
                      className="w-full py-3 text-sm mb-0"
                    >
                      Haus Subiaco
                      <p className="secondary font-light">Unterbringung im Haus Subiaco
                        <br />
                        Einzelzimmer, Bad am Gang
                        30€ / Nacht</p>
                    </Label>
                  </div>
                  <div className="flex items-center ps-4 rounded border border-gray-700">
                    <RadioField
                      id="privatquartier"
                      name="accommodationLocation"
                      errorClassName="error"
                      validation={{ required: { value: true, message: "Wähle aus wo du übernachten wirst" } }}
                      value="privatquartier"
                    />
                    <Label
                      name="accomodationLocation"
                      htmlFor="no-acc"
                      className="w-full py-3 text-sm mb-0"
                    >
                      Privatquartier
                      <p className="secondary font-light">Unterbringung bei Familie in Umgebung von Kremsmünster
                        Kann bis zu 20 km entfernt sein (Auto benötigt).
                        <br />
                        Vergabe näherer Quartiere nach Bedarf. kostenfrei
                      </p>
                    </Label>
                  </div>
                </div>
              </>)}

            <FieldError name="accommodation" className="error ms-2" />
          </div>

          <div>
            <div className="label">Ich bin anwesend von...<span className="font-bold text-primary-500">*</span></div>

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
                    required: { value: true, message: "Wann kommst du?" },
                    validate: validateStartDate
                  }}
                  defaultValue={startDate.toISOString().slice(0, 10)}
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
                    required: { value: true, message: "Wann fährtst du heim?" },
                    validate: validateEndDate
                  }}
                  defaultValue={endDate.toISOString().slice(0, 10)}
                />
                <FieldError name="endDate" className="error ms-2" />
              </div>
            </div>
            <p className={"secondary mt-2"}>Jugendtreffen findet
              von {startDate.toLocaleDateString()} bis {endDate.toLocaleDateString()} statt</p>
          </div>

          <div>
            <div className="label">Ich esse...<span className="font-bold text-primary-500">*</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center ps-4 border rounded border-gray-700">
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
                  validation={{ required: { value: true, message: "Wähle aus was du essen magst" } }}
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
                  required: { value: true, message: "Akzeptiere den Verhaltenscodex um teilzunehmen!" },
                  valueAsBoolean: true
                }}
                disabled={!hasOpenedLink}
              />
              <Label
                name="acceptCoC"
                className="ms-2"
              >
                Ich habe den{" "}
                <a onClick={() => setHasOpenedLink(true)}
                   href="https://jugendtreffen.at/wp-content/uploads/2024/03/Verhaltenskodex-fu%CC%88r-Teilnehmende-2024.pdf"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="link text-accent inline-flex"
                >
                  Verhaltenscodex
                  <InfoIcon />
                </a>{" "}
                gelesen und akzeptiere diesen.<span className="font-bold text-primary-500">*</span>
              </Label>
            </div>
            <FieldError name="acceptCoC" className="ms-6 error"></FieldError>
          </div>

          {/*<div className="flex">*/}
          {/*  <div className="flex items-center h-5">*/}
          {/*    <CheckboxField*/}
          {/*      name="helpAfterwards"*/}
          {/*      validation={{ valueAsBoolean: true }}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div>*/}
          {/*    <Label*/}
          {/*      name="helpAfterwards"*/}
          {/*    >*/}
          {/*      Ich kann beim Abbau Mithelfen.*/}
          {/*    </Label>*/}
          {/*    <p className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-300">*/}
          {/*      Wir würden uns sehr freuen, wenn du noch ein paar Stunden bleibst und uns beim Abbau hilfst.*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <div className="flex">
            <div className="flex items-center h-5">
              <CheckboxField
                name="acceptPhotos"
                validation={{
                  required: true,
                  valueAsBoolean: true
                }}
                errorClassName="error"
              />
            </div>
            <div>
              <Label
                name="acceptPhotos"
              >
                Ich stimme zu, fotografiert oder gefilmt werden zu dürfen.<span
                className="font-bold text-primary-500">*</span>
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
            Teilnehmen
          </Submit>
          <FormError error={error} wrapperClassName="form-error" />
        </Form>
      </div>
    </>
  );
};

export default EventPage;
