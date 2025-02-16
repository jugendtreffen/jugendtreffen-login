import { InputField, Label, PasswordField, TextField } from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { Metadata } from "@redwoodjs/web";

import { useAuth } from "src/auth";
import Card from "src/components/Card/Card";
import AlertCenter from "src/components/Alert/AlertCenter";
import { useAlert } from "src/components/Alert/AlertContext";
import { useState } from "react";
import MultiStepForm from "src/components/MultiStepForm/MultiStepForm";
import Step from "src/components/MultiStepForm/Step";

const SignupPage = () => {
  const { client, isAuthenticated, userMetadata } = useAuth();
  const { addAlert, removeAllAlerts } = useAlert();

  const onSubmit = async (data) => {
    removeAllAlerts();
    try {
      const response = await client.auth.signUp({
        email: data.email,
        password: data.password
      });
      console.log("response: ", response);
      response?.error?.message
        ? addAlert(response.error.message, "error")
        : navigate(routes.home());
    } catch (error) {
      console.log("error:  ", error);
      addAlert(error.message, "error");
    }
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
        <MultiStepForm className="space-y-4 md:space-y-6" finishText="account erstellen" onSubmit={onSubmit}>
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
                name="password"
                className="label"
              >
                Passwort bestätigen
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
          </Step>
          <Step>
            <TextField name="name"></TextField>
          </Step>
        </MultiStepForm>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
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
