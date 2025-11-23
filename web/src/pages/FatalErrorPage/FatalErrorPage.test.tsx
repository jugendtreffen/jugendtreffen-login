import { render, screen } from '@redwoodjs/testing/web'
import FatalErrorPage from './FatalErrorPage'

describe('FatalErrorPage', () => {
  it('renders without crashing', () => {
    expect(() => render(<FatalErrorPage />)).not.toThrow()
  })

  it('renders main element', () => {
    render(<FatalErrorPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
