// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const SignupPage = () => {
  return (
    <>
      <Metadata title="Signup" description="Signup page" />

      <h1>SignupPage</h1>
      <p>
        Find me in <code>./web/src/pages/SignupPage/SignupPage.tsx</code>
      </p>
      {/*
          My default route is named `signup`, link to me with:
          `<Link to={routes.signup()}>Signup</Link>`
      */}
    </>
  )
}

export default SignupPage
