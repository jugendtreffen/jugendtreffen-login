import { render } from '@redwoodjs/testing/web'

import QuartierPage from './QuartierPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('QuartierPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QuartierPage />)
    }).not.toThrow()
  })
})
