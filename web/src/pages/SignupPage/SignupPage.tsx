import {Metadata} from '@redwoodjs/web'

import {SignupForm, SignupInput} from '@/components/Auth/SignupForm'
import { useAlert } from '@/hooks/AlertHook'
import { useAuth } from 'src/auth'

import AlertCenter from 'src/components/Alert/AlertCenter'
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const SignupPage = () => {
  const { client, isAuthenticated, currentUser } = useAuth()
  const { addAlert, removeAllAlerts } = useAlert()

  const onSubmit = async (input: SignupInput) => {
    if (!input.email) return
    removeAllAlerts()
    try {
      const response = await client.auth.signUp({
        email: input.email,
        password: input.password,
      })
      if (response?.error?.message) {
        addAlert(response.error.message, 'error')
      }
    } catch (error) {
      addAlert(error.message, 'error')
    }
  }

  if (isAuthenticated) {
    return (
      <>
        <Metadata
          title="Anmeldung"
          description="Erstelle einen Mitarbeiter Account"
        />

        <div className="flex w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <Card className="flex flex-col gap-1">
              <CardHeader>
                <CardTitle className="text-center">Angemeldet als</CardTitle>
                <CardDescription className="text-center">{currentUser?.email}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="w-1/2 mx-auto">
          <AlertCenter className="mt-2"></AlertCenter>
        </div>
      </>
    )
  }

  return (
    <>
      <Metadata
        title="Anmeldung"
        description="Erstelle einen Mitarbeiter Account"
      />

      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <SignupForm onSubmit={onSubmit} />
        </div>
      </div>
      <div className="w-1/2 mx-auto">
        <AlertCenter className="mt-2"></AlertCenter>
      </div>
    </>
  )
}

export default SignupPage
