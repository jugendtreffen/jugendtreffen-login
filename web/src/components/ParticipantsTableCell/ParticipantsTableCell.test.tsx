import { fireEvent, screen, within } from '@redwoodjs/testing/web'

import { useSidebar } from '@/layouts/SidebarLayout/SidebarLayout'
import { renderWithProviders } from '@/test/renderWithProviders'

import { Empty, Failure, Loading, Success } from './ParticipantsTableCell'
import { standard } from './ParticipantsTableCell.mock'

const SubState = () => {
  const { subState } = useSidebar()
  return <p data-testid="sub-state">{subState ?? ''}</p>
}

const renderSuccess = () =>
  renderWithProviders(
    <>
      <Success participants={standard().participants} />
      <SubState />
    </>,
    { withSidebar: true }
  )

describe('ParticipantsTableCell', () => {
  beforeEach(() => {
    mockCurrentUser({ id: '1', email: 'checkin@example.com', roles: ['checkin'] })
  })

  it('renders Loading successfully', () => {
    expect(() => renderWithProviders(<Loading />)).not.toThrow()
  })

  it('renders Empty with an info message', () => {
    renderWithProviders(<Empty />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Es haben sich noch keine Teilnehmer angemeldet'
    )
  })

  it('renders Failure with the error message', () => {
    renderWithProviders(<Failure error={new Error('Oh no')} />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Fehler beim Laden der Teilnehmer: Oh no'
    )
  })

  it('renders all participants with checkin status', () => {
    renderSuccess()

    expect(screen.getByText('Anna')).toBeInTheDocument()
    expect(screen.getByText('Gruber')).toBeInTheDocument()
    expect(screen.getByText('clara@example.com')).toBeInTheDocument()
    expect(screen.getAllByText('Ja')).toHaveLength(1)
    expect(screen.getAllByText('Nein')).toHaveLength(2)
  })

  it('filters by first or last name', () => {
    renderSuccess()

    fireEvent.change(
      screen.getByPlaceholderText('Nach Vor- oder Nachname suchen...'),
      { target: { value: 'grub' } }
    )

    expect(screen.getByText('Ben')).toBeInTheDocument()
    expect(screen.queryByText('Anna')).not.toBeInTheDocument()
    expect(screen.queryByText('Clara')).not.toBeInTheDocument()
  })

  it('opens the checkin details for a participant', () => {
    renderSuccess()

    const table = screen.getByRole('table')
    fireEvent.click(within(table).getAllByRole('button', { name: /Checkin/ })[0])

    expect(localStorage.getItem('selectedParticipantId')).toBe('42')
    expect(screen.getByTestId('sub-state')).toHaveTextContent('Details')
  })
})
