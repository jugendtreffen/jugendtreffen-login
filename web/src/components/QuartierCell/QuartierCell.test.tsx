import { render } from '@redwoodjs/testing/web'

import QuartierCell from './QuartierCell'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('QuartierCell', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<QuartierCell />)
    }).not.toThrow()
  })
})
