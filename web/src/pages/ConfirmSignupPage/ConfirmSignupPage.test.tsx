import { render } from '@redwoodjs/testing/web'

import ConfirmSignupPage from './ConfirmSignupPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ConfirmSignupPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ConfirmSignupPage />)
    }).not.toThrow()
  })
})
