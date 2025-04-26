import {
  DateField,
  FieldError,
  InputField,
  Label,
  PasswordField,
  SelectField,
  SubmitHandler,
  useForm
} from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { Metadata, useMutation } from "@redwoodjs/web";

import { useAuth } from "src/auth";
import Card from "src/components/Card/Card";
import AlertCenter from "src/components/Alert/AlertCenter";
import { useAlert } from "src/components/Alert/AlertContext";
import React, { useState } from "react";
import MultiStepForm from "src/components/MultiStepForm/MultiStepForm";
import Step from "src/components/MultiStepForm/Step";
import { CreatePersonlaDataMutation, CreatePersonlaDataMutationVariables } from "types/graphql";
import { CheckIcon } from "src/components/Icons/Icons";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";
import Alert from "src/components/Alert/Alert";

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
`;

interface FormValues {
  email: string;
  password: string;
  password_ctl: string;
  name: string;
  familyName: string;
  birthdate: string;
  gender: string;
  phoneNumber: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  roleId: number;
  userId: string;
}

const SignupPage = () => {
  const { client, isAuthenticated, userMetadata } = useAuth();
  const { addAlert, removeAllAlerts } = useAlert();
  const [signupCompleted, setSignupCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const formMethods = useForm({
    mode: "onBlur",
    resolver: null
  });
  const [create, {
    loading
  }] = useMutation<CreatePersonlaDataMutation, CreatePersonlaDataMutationVariables>(CREATE_PERSONALDATA, {
    onCompleted: () => {
      setSignupCompleted(true);
      formMethods.reset();
    }
  });

  const validatePassword = (confirmationPassword) => {
    let password = formMethods.getValues()["password"];
    if (confirmationPassword !== password) {
      return "Die Passwörter stimmen nicht überein.";
    }
  };
  const validateBirthDate = (value) => {
    let max_bd = new Date(new Date().getFullYear() - 13, 7, 31);
    if (value >= max_bd) {
      return "Teilnehmende müssen mindestens 14 Jahre alt sein oder in diesem Schuljahr (2024/25) die 8. Schulstufe besucht haben. Stichtag ist der 31.08.2011. Eine Teilnahme ist bis zum 30. Lebensjahr möglich.";
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
    removeAllAlerts();
    input.roleId = 3;
    try {
      const response = await client.auth.signUp({
        email: input.email,
        password: input.password
      });
      response?.error?.message
        ? addAlert(response.error.message, "error")
        : input.userId = response.data.user.id;
    } catch (error) {
      addAlert(error.message, "error");
    }
    const { email, password, password_ctl, ...personalData } = input;
    await create({ variables: { input: personalData } }).catch(error => {
      addAlert(error.message, "error");
    });
  }

  const handleResend = async () => {
    if (!client) {
      setErrorMessage("Es ist ein Fehler aufgetreten");
      return;
    }

    const { error } = await client.auth.signInWithOtp({
      email: formMethods.getValues().email
    });
    setResendDisabled(true);
    setTimeout(() => {
      setResendDisabled(false);
      setErrorMessage("");
    }, 60000);

    if (error) {
      setErrorMessage("Bestätigungsmail konnte nicht gesendet werden. Versuche es in 2 Minuten nochmal!");
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <Metadata title="Anmeldung" />

        <Card className="flex flex-col gap-1" button={{ message: "Zu den Events", to: routes.home() }}>
          <span className={"text-green-500"}><CheckIcon /></span>
          <h2 className={"mb-3"}>Du bist als <span
            className="code text-primary-500">{userMetadata.email}</span> angemeldet!</h2>
        </Card>
      </>
    );
  }

  if (signupCompleted) {
    return (
      <>
        <Metadata title="Anmeldung" />

        <Card className="flex flex-col gap-1"
              button={{ message: "weiter zur Anmeldung", to: routes.login({ next: routes.events({ id: "0" }) }) }}>
          <div className="flex flex-row gap-2">
            <span className="text-green-500"><CheckIcon /></span>
            <p className="secondary text-end w-full">Schritt: 3/4</p>
          </div>
          <h2 className={"mb-3"}>Dein Account wurde erstellt. Bestätige die Email die wir dir gesendet haben</h2>
          <p className="secondary mb-3">Bitte schau nach ob die Mail eventuell im Spam Orner gelandet ist</p>
          <button className="secondary mb-2" onClick={handleResend} disabled={resendDisabled}>Email erneut senden
          </button>
          {errorMessage !== "" && <Alert id="0" type="error" message={errorMessage} dismissible={false}></Alert>}
        </Card>
      </>
    );
  }

  return (
    <>
      <Metadata title="Anmeldung" description="Erstelle einen Account um am Jugendtreffen teilzunehmen." />

      <Card>
        <h1>
          Account für Teilnahme erstellen
        </h1>
        <MultiStepForm className="space-y-4 md:space-y-6" finishText="Account erstellen" onSubmit={onSubmit}
                       disableSubmit={loading}
                       formMethods={formMethods}>
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
                  required: { value: true, message: "Bitte gib ein Passwort an" },
                  minLength: { value: 6, message: "Passwort muss mindestens 6 Zeichen beinhalten" }
                }}
              />
              <FieldError name="password" className="error ms-2" />
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
                  required: { value: true, message: "Bitte Betätige das Passwort" },
                  validate: {
                    passwordConfirmation: (value) => {
                      return validatePassword(value);
                    }
                  }
                }}
              />
              <FieldError name="password_ctl" className="error ms-2" />
            </div>
          </Step>

          <Step>
            <p className="secondary text-end">Schritt: 1/4</p>
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
              <Label name={"birthdate"} errorClassName={"error"}>Geburtsdatum</Label>
              <DateField name={"birthdate"}
                         validation={{
                           required: { value: true, message: "Bitte gebe dein Geburtsdatum an" },
                           validate: validateBirthDate
                         }}
                         errorClassName="error"
              />
              <FieldError name={"birthdate"} className={"error"} />
            </div>
            <div>
              <Label name={"phoneNumber"} errorClassName={"error"}>
                Handynummer
              </Label>
              <InputField
                name={"phoneNumber"}
                validation={{ required: true }}
                placeholder="+43 1234 12345678 "
                errorClassName={"error"}
              >
              </InputField>
            </div>
            <div>
              <Label name={"gender"} errorClassName={"error"}>
                Geschlecht
              </Label>
              <SelectField
                name={"gender"}
                validation={{ required: true }}
                errorClassName={"error"}
              >
                <option value="" disabled selected={true}>
                  Bitte wählen Sie
                </option>
                <option value="male">Männlich</option>
                <option value="female">Weiblich</option>
              </SelectField>
            </div>
          </Step>

          <Step>
            <p className="secondary text-end">Schritt: 2/4</p>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
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
              </>
            )}
          </Step>
        </MultiStepForm>
        <p className="mt-5 text-sm font-light text-gray-500 dark:text-gray-400">
          Du hast bereits einen Account?{" "}
          <Link
            to={routes.login()}
            className="font-medium hover:underline "
          >
            Melde dich hier an
          </Link>
        </p>
      </Card>
      <AlertCenter className="mt-2"></AlertCenter>
    </>
  );
};

export default SignupPage;
