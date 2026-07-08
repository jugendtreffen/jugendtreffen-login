import { render } from '@redwoodjs/testing/web'

import ConfirmSignupPage from './VerifySignupPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('VerifySignupPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ConfirmSignupPage />)
    }).not.toThrow()
  })
})
