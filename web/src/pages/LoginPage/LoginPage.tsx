// import { Link, routes } from '@redwoodjs/router'
import { Form, PasswordField, Submit, TextField } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

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
      <Metadata title="Login" description="Login page" />

      <h1>LoginPage</h1>
      {isAuthenticated ? (
        <div>You are already logged in as {userMetadata.email}</div>
      ) : (
        <Form onSubmit={onSubmit}>
          {error && <p>{error}</p>}
          <TextField name="email" placeholder="email" />
          <PasswordField name="password" placeholder="password" />
          <Submit>Sign In</Submit>
        </Form>
      )}
    </>
  )
}

export default LoginPage
