import React, { useEffect, useState } from 'react'

import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Alert from 'src/components/Alert/Alert'
import Card from 'src/components/Card/Card'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'
import { ArrowRight, Info } from 'lucide-react'

const ConfirmSignupPage = (props) => {
  const { token_hash, email, next } = props
  const { client, isAuthenticated } = useAuth()
  const [confirmationStatus, setConfirmationStatus] = useState('pending')
  const [errorMessage, setErrorMessage] = useState(
    'Es ist ein Fehler aufgetreten'
  )
  const [resendDisabled, setResendDisabled] = useState(false)

  const confirmEmail = async (token, redirectTo) => {
    try {
      if (!client) {
        setConfirmationStatus('error')
        return
      }
      const { error } = await client.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })

      if (error) {
        setConfirmationStatus('error')
        setErrorMessage(error.message)
      } else {
        setConfirmationStatus('success')
        if (redirectTo) {
          setTimeout(() => navigate(redirectTo, { replace: true }), 1000)
        }
      }
    } catch (error) {
      setConfirmationStatus('error')
    }
  }

  const handleResend = async () => {
    if (!client) {
      setConfirmationStatus('error')
      return
    }

    const { error } = await client.auth.signInWithOtp({
      email: email,
    })
    setResendDisabled(true)
    setTimeout(() => {
      setResendDisabled(false)
      setConfirmationStatus('pending')
    }, 60000)

    if (error) {
      setConfirmationStatus('error')
      setErrorMessage(
        'Bestätigungsmail konnte nicht gesendet werden. Versuche es in 2 Minuten nochmal!'
      )
    } else {
      setConfirmationStatus('pending')
    }
  }

  useEffect(() => {
    if (token_hash) {
      confirmEmail(token_hash, next)
    } else {
      setConfirmationStatus('error')
      setErrorMessage('Bestätigungslink nicht gültig')
    }
  }, [token_hash, next])

  if (isAuthenticated) {
    navigate(next || routes.home())
  }

  return (
    <>
      <Metadata title="ConfirmSignup" description="ConfirmSignup page" />

      <Card>
        <h1 className="mb-2">Email Bestätigung</h1>
        {confirmationStatus === 'pending' && (
          <>
            <LoadingSpinner></LoadingSpinner>
            <p>Klicke auf den Link in deiner Email</p>
          </>
        )}
        {confirmationStatus === 'success' && (
          <>
            <span className={'text-green-500'}>
              <Info />
            </span>
            <p>Deine Email wurde erfolgreich bestätigt!</p>
            <Link
              to={routes.home()}
              className="primary inline-flex items-center mt-2"
            >
              Anmeldung fertigstellen
              <ArrowRight />
            </Link>
          </>
        )}
        {confirmationStatus === 'error' && (
          <>
            <Alert
              id="0"
              type="error"
              message={errorMessage}
              dismissible={false}
            ></Alert>
            <button
              className="primary"
              onClick={handleResend}
              disabled={resendDisabled}
            >
              Email erneut senden
            </button>
          </>
        )}
      </Card>
    </>
  )
}

export default ConfirmSignupPage
