import { render } from '@redwoodjs/testing/web'

import RegistrationFormPage from './EventRegistrationPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('RegistrationFormPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RegistrationFormPage />)
    }).not.toThrow()
  })
})
