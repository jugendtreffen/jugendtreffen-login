import { fireEvent, render, screen, waitFor } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'

import EventRegistrationForm from './EventRegistrationForm'

const event = {
  id: '1',
  name: 'Jugendtreffen 2026',
  startDate: '2026-07-01',
  endDate: '2026-07-05',
}

const renderForm = () =>
  render(
    <AlertProvider>
      <EventRegistrationForm event={event} />
    </AlertProvider>
  )

describe('EventRegistrationForm', () => {
  it('renders the registration fields', () => {
    renderForm()

    expect(screen.getByLabelText('Vorname')).toBeInTheDocument()
    expect(screen.getByLabelText('Nachname')).toBeInTheDocument()
    expect(screen.getByLabelText('E-Mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefonnummer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anmelden' })).toBeInTheDocument()
  })

  it('shows validation errors and does not submit an empty form', async () => {
    const createParticipant = jest.fn()
    mockGraphQLMutation('CreateRegisteredParticipantMutation', createParticipant)
    renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Anmelden' }))

    expect(
      await screen.findByText('Bitte gib deinen Vornamen an')
    ).toBeInTheDocument()
    expect(screen.getByText('Bitte gib deinen Nachnamen an')).toBeInTheDocument()
    await waitFor(() => expect(createParticipant).not.toHaveBeenCalled())
  })

  it('only enables the code of conduct checkbox after opening the link', () => {
    renderForm()

    const coc = screen.getAllByRole('checkbox')[0]
    expect(coc).toBeDisabled()

    fireEvent.click(screen.getByRole('link', { name: /Verhaltenskodex/ }))
    expect(coc).toBeEnabled()
  })

  it('offers the participant accommodations by default', () => {
    renderForm()

    expect(screen.getByLabelText('beim Jugendtreffen')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Privatunterkunft (organisiert vom Jugendtreffen)')
    ).not.toBeInTheDocument()
  })
})
