import { Route, Router, Set } from "@redwoodjs/router";

import { useAuth } from "src/auth";
import GlobalLayout from "src/layouts/GlobalLayout/GlobalLayout";
import PageLayout from "src/layouts/AuthLayout/AuthLayout";

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={GlobalLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Set wrap={PageLayout}>
          <Route path="/login" page={LoginPage} name="login" />
          <Route path="/signup" page={SignupPage} name="signup" />
          <Route path="/confirm" page={ConfirmSignupPage} name="confirmSignup" />
          <Route path="/events/{id}" page={EventPage} name="events" />
        </Set>
      </Set>
      <Route notfound page={NotFoundPage} prerender />
    </Router>
  )
}

export default Routes
