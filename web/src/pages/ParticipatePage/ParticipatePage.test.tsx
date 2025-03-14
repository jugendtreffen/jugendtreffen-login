import { render } from '@redwoodjs/testing/web'

import ParticipatePage from './ParticipatePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ParticipatePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ParticipatePage />)
    }).not.toThrow()
  })
})
