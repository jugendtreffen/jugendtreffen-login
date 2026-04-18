import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { SignupForm } from '@/components/Auth/SignupForm'
import { useAlert } from '@/hooks/AlertHook'
import { useAuth } from 'src/auth'

import AlertCenter from 'src/components/Alert/AlertCenter'

export interface SignupFormValues {
  email: string
  password: string
  confirm_password: string
}

const SignupPage = () => {
  const { client, isAuthenticated } = useAuth()
  const { addAlert, removeAllAlerts } = useAlert()

  const onSubmit = async (input: SignupFormValues) => {
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
    navigate(routes.home())
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
