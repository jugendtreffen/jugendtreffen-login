import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { LoginForm } from '@/components/Auth/LoginForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from 'src/auth'
import AlertCenter from 'src/components/Alert/AlertCenter'
import { useAlert } from '@/hooks/AlertHook'

const LoginPage = (props) => {
  const { next } = props
  const { logIn, isAuthenticated, userMetadata } = useAuth()
  const { addAlert, removeAllAlerts } = useAlert()

  const onSubmit = async (data) => {
    removeAllAlerts()
    try {
      const response = await logIn({
        email: data.email,
        password: data.password,
        authMethod: 'password',
      })
      response?.error?.message
        ? addAlert(response.error.message, 'error')
        : navigate(next || routes.home())
    } catch (error) {
      addAlert(error.message, 'error')
    }
  }

  if (isAuthenticated) {
    if (next) {
      navigate(next)
    }
    return (
      <>
        <Metadata title="Anmelden" description="Login page" />

        <Card className="flex flex-col gap-1">
          <CardHeader>
            <CardTitle>
              You are already logged in as{' '}
              <span className="code">{userMetadata.email}</span>
            </CardTitle>
          </CardHeader>
          <Link className="primary" to={routes.home()}>
            Home
          </Link>
        </Card>
      </>
    )
  }

  return (
    <>
      <Metadata title="Anmelden" description="Login page" />
      <div className="w-1/2 mx-auto">
        <AlertCenter className="mt-2"></AlertCenter>
      </div>

      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <LoginForm onSubmit={onSubmit} />
        </div>
      </div>
    </>
  )
}

export default LoginPage
