// import { Link, routes } from '@redwoodjs/router'
import { Form, InputField, Label, PasswordField, Submit, TextField } from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Alert from "src/components/Alert/Alert";

const LoginPage = () => {
  const { logIn, isAuthenticated, userMetadata } = useAuth()
  const [error, setError] = React.useState(null)

  const onSubmit = async (data) => {
    setError(null)
    try {
      const response = await logIn({
        email: data.email,
        password: data.password,
        authMethod: 'password',
      })
      response?.error?.message
        ? setError(response.error.message)
        : navigate(routes.home())
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <Metadata title="Anmelden" description="Login page" />

      <section className="flex flex-col items-center py-6 mx-auto lg:py-0">
        <Alert type={'error'} message={error} show={error != null} dismiss={true}></Alert>
        <div className="w-full bg-white rounded-lg shadow dark:border mt-6 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Bei Jugendtreffen Anmelden
            </h1>
            <Form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
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
                    required: true,
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
                <InputField
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input"
                  errorClassName="input error"
                  validation={{
                    required: true,
                  }}
                />
              </div>
              {/*<div className="flex items-center justify-end">*/}
              {/*  <Link*/}
              {/*    to={routes.login()}*/}
              {/*    className="text-sm font-medium text-blue-500 hover:underline"*/}
              {/*  >*/}
              {/*    Passwort vergessen?*/}
              {/*  </Link>*/}
              {/*</div>*/}
              <Submit className="primary w-full">
                Anmelden
              </Submit>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Du hast noch keinen Account?{' '}
                <Link
                  to={routes.signup()}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Erstelle hier einen
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </section>
    </>
  )
}

export default LoginPage
