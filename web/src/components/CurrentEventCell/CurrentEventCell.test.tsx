import { render, screen } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'

import { Empty, Failure, Loading, Success } from './CurrentEventCell'
import { standard } from './CurrentEventCell.mock'

const renderWithAlert = (ui: React.ReactElement) =>
  render(<AlertProvider>{ui}</AlertProvider>)

describe('CurrentEventCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty with a hint and a back button', () => {
    render(<Empty />)
    expect(screen.getByText('Kein anstehendes Event')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zurück/ })).toBeInTheDocument()
  })

  it('renders Failure with the error message', () => {
    renderWithAlert(<Failure error={new Error('Oh no')} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Oh no')
  })

  it('renders the registration form for the current event', () => {
    renderWithAlert(<Success currentEvent={standard().currentEvent} />)

    expect(
      screen.getByText('Anmeldung Jugendtreffen 2026')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Vorname')).toBeInTheDocument()
  })
})
