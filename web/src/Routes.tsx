// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import GlobalLayout from 'src/layouts/GlobalLayout/GlobalLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Set wrap={GlobalLayout}>
        <Route path="/" page={HomePage} name="home" prerender />
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/confirm" page={ConfirmSignupPage} name="confirmSignup" />
        <Route path="/teilnehmen" page={ParticipatePage} name="participate" />
        <Route path="/events/{id}" page={EventPage} name="events" />
      </Set>
      <Route notfound page={NotFoundPage} prerender />
    </Router>
  )
}

export default Routes
