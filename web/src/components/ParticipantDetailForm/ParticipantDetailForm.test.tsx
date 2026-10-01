import { fireEvent, screen, waitFor } from '@redwoodjs/testing/web'

import { Dialog } from '@/components/ui/dialog'
import { renderWithProviders } from '@/test/renderWithProviders'

import ParticipantDetailForm from './ParticipantDetailForm'

const participant = {
  __typename: 'Participant',
  id: 'p1',
  name: 'Anna',
  familyName: 'Huber',
  birthdate: '2008-03-01',
  gender: 'female',
  email: 'anna@example.com',
  phoneNumber: '+43 660 1234567',
  phoneCaretakerContact: null,
  foundUsBy: null,
  country: 'AT',
  city: 'Kremsmünster',
  postalCode: '4550',
  address: 'Stiftsplatz 1',
  travelMethod: 'train',
  accommodation: 'jugendtreffen',
  startDate: '2026-07-01',
  endDate: '2026-07-05',
  foodChoice: 'any',
  acceptPhotos: true,
  acceptCoC: true,
  participationRole: 'teilnehmer',
  checkinConfirmed: false,
  price: 120,
  bandColour: 'dark_green_ue16',
  eventId: '1',
  event: { __typename: 'Event', startDate: '2026-07-01', endDate: '2026-07-05' },
}

const renderForm = (overrides = {}) =>
  renderWithProviders(
    <Dialog>
      <ParticipantDetailForm
        participant={{ ...participant, ...overrides } as never}
        loading={false}
      />
    </Dialog>,
    { withSidebar: true }
  )

describe('ParticipantDetailForm', () => {
  let updateParticipant: jest.Mock

  beforeEach(() => {
    mockCurrentUser({ id: '1', email: 'checkin@example.com', roles: ['checkin'] })
    updateParticipant = jest.fn((vars) => ({
      updateParticipant: { __typename: 'Participant', id: vars.id },
    }))
    mockGraphQLMutation('UpdateParticipantDetail', updateParticipant)
  })

  it('shows a skeleton while loading', () => {
    renderWithProviders(
      <ParticipantDetailForm participant={undefined} loading />,
      { withSidebar: true }
    )
    expect(screen.queryByLabelText('Vorname')).not.toBeInTheDocument()
  })

  it('fills the form with the participant data', async () => {
    renderForm()

    expect(await screen.findByDisplayValue('Anna')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Huber')).toBeInTheDocument()
    expect(screen.getByDisplayValue('anna@example.com')).toBeInTheDocument()
    expect(screen.getByText('Über 16')).toBeInTheDocument()
  })

  it('only lets admins edit the price', async () => {
    renderForm()
    expect(await screen.findByPlaceholderText('0,00 €')).toBeDisabled()
  })

  it('saves the changed participant data', async () => {
    renderForm()

    fireEvent.change(await screen.findByDisplayValue('Anna'), {
      target: { value: 'Anna-Lena' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Speichern$/ }))

    await waitFor(() => expect(updateParticipant).toHaveBeenCalled())
    const { id, input } = updateParticipant.mock.calls[0][0]
    expect(id).toBe('p1')
    expect(input.name).toBe('Anna-Lena')
    expect(input.checkinConfirmed).toBe(false)
  })

  it('does not save when the form is invalid', async () => {
    renderForm()

    fireEvent.change(await screen.findByDisplayValue('Anna'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Speichern$/ }))

    expect(
      await screen.findByText('Bitte korrigiere zuerst die Formularfehler.')
    ).toBeInTheDocument()
    expect(updateParticipant).not.toHaveBeenCalled()
  })

  it('requires both confirmations before checking in', async () => {
    renderForm()

    fireEvent.click(
      await screen.findByRole('button', { name: /Speichern und Einchecken/ })
    )
    const checkinButton = await screen.findByRole('button', {
      name: /^Einchecken/,
    })
    expect(checkinButton).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/Alter des Teilnehmers/))
    expect(checkinButton).toBeDisabled()
    fireEvent.click(screen.getByLabelText(/Einverständniserklärung/))
    expect(checkinButton).toBeEnabled()

    fireEvent.click(checkinButton)

    await waitFor(() => expect(updateParticipant).toHaveBeenCalled())
    expect(updateParticipant.mock.calls[0][0].input.checkinConfirmed).toBe(true)
  })

  it('asks for photo consent at checkin if it was not given', async () => {
    renderForm({ acceptPhotos: false })

    fireEvent.click(
      await screen.findByRole('button', { name: /Speichern und Einchecken/ })
    )
    expect(
      await screen.findByLabelText(/Fotos und Videos gemacht/)
    ).toBeInTheDocument()
  })

  it('offers to go back once the participant is checked in', async () => {
    renderForm({ checkinConfirmed: true })

    expect(
      await screen.findByRole('button', { name: /Zurück zur Übersicht/ })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Speichern und Einchecken/ })
    ).not.toBeInTheDocument()
  })
})
