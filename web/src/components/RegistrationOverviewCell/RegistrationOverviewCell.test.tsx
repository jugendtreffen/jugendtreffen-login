import { render, screen } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'

import { Empty, Failure, Loading, Success } from './RegistrationOverviewCell'
import { standard } from './RegistrationOverviewCell.mock'

const renderWithAlert = (ui: React.ReactElement) =>
  render(<AlertProvider>{ui}</AlertProvider>)

describe('RegistrationOverviewCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty with a not-found message', () => {
    renderWithAlert(<Empty />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Anmeldung nicht gefunden'
    )
  })

  it('renders Failure with the error name', () => {
    renderWithAlert(<Failure id={'42'} error={new Error('Oh no')} />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Bitte versuche es später erneut: Error'
    )
  })

  it('renders the formatted registration summary', () => {
    renderWithAlert(<Success id={'42'} participant={standard().participant} />)

    expect(screen.getByText('Anmeldung erfolgreich!')).toBeInTheDocument()
    expect(screen.getByText('Jugendtreffen 2026')).toBeInTheDocument()
    expect(screen.getByText('Mustermann')).toBeInTheDocument()
    expect(screen.getByText('17.05.2008')).toBeInTheDocument()
    expect(screen.getByText('Männlich')).toBeInTheDocument()
    expect(screen.getByText('Österreich')).toBeInTheDocument()
    expect(screen.getByText('Zug')).toBeInTheDocument()
    expect(screen.getByText('Beim Jugendtreffen')).toBeInTheDocument()
    expect(screen.getByText('Vegetarisch')).toBeInTheDocument()
    expect(screen.getByText('Teilnehmer')).toBeInTheDocument()
    expect(screen.getAllByText('Ja')).toHaveLength(2)
  })
})
