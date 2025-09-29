import { render, screen } from '@redwoodjs/testing/web'

import NavbarLayout from './NavbarLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NavbarLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NavbarLayout />)
    }).not.toThrow()
  })

  it('renders Navigation and Footer components', () => {
    render(<NavbarLayout>Test Content</NavbarLayout>)
    expect(screen.getByRole('banner')).toBeInTheDocument() // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
  })

  it('renders children inside main', () => {
    render(<NavbarLayout>Test Content</NavbarLayout>)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveTextContent('Test Content')
  })
})
