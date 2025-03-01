import { Form, PasswordField, Submit, TextField } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const SignupPage = () => {
   const { client, isAuthenticated, userMetadata } = useAuth()
  const [error, setError] = React.useState(null)

  const onSubmit = async (data) => {
    setError(null)
    try {
      const response = await client.auth.signUp({
        email: data.email,
        password: data.password,
      })
      console.log('response: ', response)
      response?.error?.message
        ? setError(response.error.message)
        : navigate(routes.home())
    } catch (error) {
      console.log('error:  ', error)
      setError(error.message)
    }
  }

  return (
    <>
      <Metadata title="Signup" description="Signup page" />

      <h1>SignupPage</h1>
      {isAuthenticated ? (
        <div>You are already logged in as {userMetadata.email}</div>
      ) : (
        <>
          {error && <div className="error">{error}</div>}
          <Form onSubmit={onSubmit}>

            <TextField name="email" placeholder="email" />
            <PasswordField name="password" placeholder="password" />
            <Submit>Sign Up</Submit>
          </Form>
        </>
      )}
    </>
  )
}

export default SignupPage
