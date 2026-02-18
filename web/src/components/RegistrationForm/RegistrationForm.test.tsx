import { render } from '@redwoodjs/testing/web'

import RegistrationForm from './RegistrationForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RegistrationForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RegistrationForm />)
    }).not.toThrow()
  })
})
