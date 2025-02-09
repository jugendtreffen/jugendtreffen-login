import { render } from '@redwoodjs/testing/web'

import LoadingSpinner from './LoadingSpinner'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('LoadingSpinner', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoadingSpinner />)
    }).not.toThrow()
  })
})
