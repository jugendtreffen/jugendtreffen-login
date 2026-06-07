import {useEffect, useState} from 'react'

import {navigate, routes} from '@redwoodjs/router'
import {Metadata} from '@redwoodjs/web'
import {ArrowRight, Info} from 'lucide-react'

import {useAuth} from 'src/auth'
import Alert from 'src/components/Alert/Alert'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Button} from "@/components/ui/button";

const ConfirmSignupPage = (props) => {
  const {token_hash, email, next} = props
  const {client, isAuthenticated} = useAuth()
  const [confirmationStatus, setConfirmationStatus] = useState('pending')
  const [errorMessage, setErrorMessage] = useState(
    'Es ist ein Fehler aufgetreten'
  )

  const confirmEmail = async (token, redirectTo) => {
    try {
      if (!client) {
        setConfirmationStatus('error')
        return
      }
      const {error} = await client.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      })

      if (error) {
        setConfirmationStatus('error')
        setErrorMessage(error.message)
      } else {
        setConfirmationStatus('success')
        if (redirectTo) {
          setTimeout(() => navigate(redirectTo, {replace: true}), 1000)
        }
      }
    } catch (error) {
      setConfirmationStatus('error')
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
      <Metadata title="ConfirmSignup" description="ConfirmSignup page"/>

      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Bestätige deine Email</CardTitle>
            </CardHeader>
            <CardContent>
              {confirmationStatus === 'pending' && (
                <p>Klicke auf den Link in deiner Email</p>
              )}
              {confirmationStatus === 'success' && (
                <>
                  <span className={'text-green-500'}>
                    <Info/>
                  </span>
                  <p>Deine Email wurde erfolgreich bestätigt!</p>
                  <Button typeof={'outline'} onClick={() => navigate(next || routes.home())}
                          className="primary inline-flex items-center mt-2"
                  >
                    Weiter
                    <ArrowRight/>
                  </Button>
                </>
              )}
              {confirmationStatus === 'error' && (
                <Alert
                  id="0"
                  type="error"
                  message={errorMessage}
                  dismissible={false}
                ></Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default ConfirmSignupPage
