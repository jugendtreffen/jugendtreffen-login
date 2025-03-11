import { InputField, Label, PasswordField, SelectField, SubmitHandler, TextField } from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { Metadata, useMutation } from "@redwoodjs/web";

import { useAuth } from "src/auth";
import Card from "src/components/Card/Card";
import AlertCenter from "src/components/Alert/AlertCenter";
import { useAlert } from "src/components/Alert/AlertContext";
import React, { useState } from "react";
import MultiStepForm from "src/components/MultiStepForm/MultiStepForm";
import Step from "src/components/MultiStepForm/Step";
import {
  CreateParticipationMutation,
  CreateParticipationMutationVariables,
  CreatePersonalDataInput, CreatePersonlaDataMutation, CreatePersonlaDataMutationVariables
} from "types/graphql";
import { toast } from "@redwoodjs/web/toast";

const CREATE_PERSONALDATA = gql`
  mutation CreatePersonlaDataMutation($input: CreatePersonalDataInput!) {
    createPersonalData(input: $input) {
      name,
      familyName,
      birthdate,
      gender,
      country,
      city,
      postalCode,
      address,
      phoneNumber,
      phoneCaretakerContact,
      userId,
    }
  }
`

interface FormValues {
  email: string
  password: string
  password_ctl: string
  name: string
  familyName: string
  birthdate: string
  gender: string
  phoneNumber: string
  country: string
  city: string
  postalCode: string
  address: string
  roleId: number
  userId: string
}

const SignupPage = () => {
  const { client, isAuthenticated, userMetadata, reauthenticate } = useAuth()
  const { addAlert, removeAllAlerts } = useAlert()
  const [create, {
    loading,
    error
  }] = useMutation<CreatePersonlaDataMutation, CreatePersonlaDataMutationVariables>(CREATE_PERSONALDATA, {onCompleted: () => {toast.success('Dein Account wurde erstellt')}});

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    removeAllAlerts()
    data.roleId = 3
    console.log(data)
    try {
      const response = await client.auth.signUp({
        email: data.email,
        password: data.password
      });
      console.log("response: ", response)
      response?.error?.message
        ? addAlert(response.error.message, "error")
        : data.userId = response.data.user.id
    } catch (error) {
      console.log("error:  ", error)
      addAlert(error.message, "error")
    }
    const { email, password, password_ctl, ...personalData } = data;
    create({ variables: { input: personalData } }).then((r) => console.log)
      .then(() => reauthenticate())
      .then(() => navigate(routes.home()))
      .catch((err) => console.log(err))
  };

  if (isAuthenticated) {
    return (
      <>
        <Metadata title="Signup success" description="Signup page" />

        <Card className="flex flex-col gap-1">
          <h2>You are already logged in as <span className="code">{userMetadata.email}</span></h2>
          <Link className="primary" to={routes.home()}>Home</Link>
        </Card>
      </>
    );
  }

  return (
    <>
      <Metadata title="Signup" description="Signup page" />

      <AlertCenter></AlertCenter>
      <Card>
        <h1>
          Werde ein Teil von uns!
        </h1>
        <MultiStepForm className="space-y-4 md:space-y-6" finishText="Account erstellen" onSubmit={onSubmit}>
          <Step>
            <div>
              <Label
                name="email"
                className="label"
              >
                Email
              </Label>
              <InputField
                type="email"
                name="email"
                errorClassName="input error"
                className="input"
                placeholder="your@mail.com"
                validation={{
                  required: true
                }}
              />
            </div>
            <div>
              <Label
                name="password"
                className="label"
              >
                Passwort
              </Label>
              <PasswordField
                name="password"
                placeholder="••••••••"
                className="input"
                errorClassName="input error"
                validation={{
                  required: true
                }}
              />
            </div>
            <div>
              <Label
                name="password_ctl"
                className="label"
              >
                Passwort bestätigen
              </Label>
              <PasswordField
                id="password_ctl"
                name="password_ctl"
                placeholder="••••••••"
                className="input"
                errorClassName="input error"
                validation={{
                  required: true
                }}
              />
            </div>
          </Step>
          <Step>

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
          </Step>
          <Step>
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
        </MultiStepForm>
        <p className="mt-5 text-sm font-light text-gray-500 dark:text-gray-400">
          Du hast bereits einen Account?{" "}
          <Link
            to={routes.login()}
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Melde dich hier an
          </Link>
        </p>

      </Card>

    </>
  );
};

export default SignupPage;
