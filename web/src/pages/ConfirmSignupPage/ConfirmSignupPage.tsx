import { Metadata } from "@redwoodjs/web";
import { useAuth } from "src/auth";
import { navigate, routes } from "@redwoodjs/router";
import React, { useEffect, useState } from "react";
import Card from "src/components/Card/Card";
import LoadingSpinner from "src/components/Loading/LoadingSpinner";
import { CheckIcon } from "src/components/Icons/Icons";
import Alert from "src/components/Alert/Alert";

const ConfirmSignupPage = (props) => {
  const { token_hash, type, email, next } = props;
  const { client, isAuthenticated, userMetadata } = useAuth();
  const [confirmationStatus, setConfirmationStatus] = useState("pending");
  const [errorMessage, setErrorMessage] = useState("Es ist ein Fehler aufgetreten");
  const [resendDisabled, setResendDisabled] = useState(false);

  const confirmEmail = async (token, redirectTo) => {
    try {
      if (!client) {
        setConfirmationStatus("error")
        return
      }
      const { error } = await client.auth.verifyOtp({
        token_hash: token,
        type: "email"
      });

      if (error) {
        setConfirmationStatus("error")
        setErrorMessage(error.message)
      } else {
        setConfirmationStatus("success")
        client.auth.reauthenticate()
        navigate(redirectTo || routes.home())
      }
    } catch (error) {
      setConfirmationStatus("error")
    }
  }

  const handleResend = async () => {
    if (!client) {
      setConfirmationStatus("error")
      return
    }

    const { error } = await client.auth.signInWithOtp({
      email: email
    })
    setResendDisabled(true)
    setTimeout(() => {setResendDisabled(true)}, 12000)

    if (error) {
      setConfirmationStatus("error")
      setErrorMessage("Bestätigungsmail konnte nicht gesendet werden. Versuche es in 2 Minuten nochmal!")
    } else {
      setConfirmationStatus("pending")
    }
  }


  useEffect(() => {
    if (token_hash && type === "email") {
      confirmEmail(token_hash, next)
    } else {
      setConfirmationStatus("error")
      setErrorMessage("Bestätigungslink nicht gültig")
    }
  }, [token_hash, type, next])

  if (isAuthenticated) {
    return (
      <>
        <Metadata title="Signup success" description="Signup page" />

        <section className="flex flex-col items-center p-6 mx-auto lg:py-0 h-full">
          <Card className="flex flex-col gap-1" button={{ message: "Zu den Events", to: routes.home() }}>
            <span className={"text-green-500"}><CheckIcon /></span>
            <h2 className={"mb-3"}>Du bist als <span
              className="code text-primary-500">{userMetadata.email}</span> angemeldet!</h2>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <Metadata title="ConfirmSignup" description="ConfirmSignup page" />

      <div className="flex flex-col items-center p-6 mx-auto lg:py-0 h-full">

        <Card>
          <h1 className="mb-2">Email Bestätigung</h1>
          {confirmationStatus === "pending" && <>
            <LoadingSpinner></LoadingSpinner>
            <p>Klicke auf den Link in deiner Email</p>
          </>}
          {confirmationStatus === "success" &&
            <>
              <CheckIcon/>
              <p>Deine Email wurde erfolgreich bestätigt!</p>
            </>
            }
          {confirmationStatus === "error" && (
            <>
              <Alert id="0" type="error" message={errorMessage} dismissible={false}></Alert>
              <button className="primary" onClick={handleResend} disabled={resendDisabled}>Email erneut senden</button>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default ConfirmSignupPage;
