import { render, screen } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'

import { Empty, Failure, Loading, Success } from './StaffCell'
import { standard } from './StaffCell.mock'

const renderWithAlert = (ui: React.ReactElement) =>
  render(<AlertProvider>{ui}</AlertProvider>)

describe('StaffCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty with a message', () => {
    renderWithAlert(<Empty />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Keine Benutzer gefunden.'
    )
  })

  it('renders Failure with the error message', () => {
    renderWithAlert(<Failure error={new Error('Oh no')} />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Fehler beim Laden der Benutzer: Oh no'
    )
  })

  it('renders one role form per staff user', () => {
    renderWithAlert(<Success staffUsers={standard().staffUsers} />)

    expect(screen.getByText('anna@example.com')).toBeInTheDocument()
    expect(screen.getByText('ben@example.com')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Speichern/ })).toHaveLength(2)
  })
})
