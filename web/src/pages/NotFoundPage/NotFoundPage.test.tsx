import { render, screen } from '@redwoodjs/testing/web'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders without crashing', () => {
    expect(() => render(<NotFoundPage />)).not.toThrow()
  })

  it('renders main element', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('shows 404 message', () => {
    render(<NotFoundPage />)
    expect(screen.getByText(/404/)).toBeInTheDocument()
    expect(screen.getByText(/missing/i)).toBeInTheDocument()
  })
})
