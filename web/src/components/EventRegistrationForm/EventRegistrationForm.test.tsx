import { render } from '@redwoodjs/testing/web'

import EventRegistrationForm from './EventRegistrationForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('EventRegistrationForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EventRegistrationForm />)
    }).not.toThrow()
  })
})
