import { Router, Route, Set } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import GlobalLayout from 'src/layouts/GlobalLayout/GlobalLayout'
import AuthLayout from "src/layouts/AuthLayout/AuthLayout";

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={GlobalLayout}>
        <Route path="/" page={HomePage} name="home" prerender />
        <Set wrap={AuthLayout}>
          <Route path="/login" page={LoginPage} name="login" />
          <Route path="/signup" page={SignupPage} name="signup" />
          <Route path="/confirm" page={ConfirmSignupPage} name="confirmSignup" />
        </Set>
        <Route path="/teilnehmen" page={ParticipatePage} name="participate" />
        <Route path="/events/{id}" page={EventPage} name="events"/>
      </Set>
      <Route notfound page={NotFoundPage} prerender />
    </Router>
  )
}

export default Routes
