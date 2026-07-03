import { render } from '@redwoodjs/testing/web'

import ParticipantDetailForm from './ParticipantDetailForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ParticipantDetailForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ParticipantDetailForm />)
    }).not.toThrow()
  })
})
