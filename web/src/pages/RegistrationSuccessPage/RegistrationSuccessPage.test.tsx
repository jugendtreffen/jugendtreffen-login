import { render } from '@redwoodjs/testing/web'

import RegistrationSuccessPage from './RegistrationSuccessPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('RegistrationSuccessPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RegistrationSuccessPage />)
    }).not.toThrow()
  })
})
