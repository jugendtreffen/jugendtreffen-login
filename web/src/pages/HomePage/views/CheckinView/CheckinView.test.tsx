import { fireEvent, screen, within } from '@redwoodjs/testing/web'

import { renderWithProviders } from '@/test/renderWithProviders'

import CheckinView from './CheckinView'

describe('CheckinView', () => {
  beforeEach(() => {
    mockCurrentUser({ id: '1', email: 'c@b.at', roles: ['checkin'] })
    mockGraphQLQuery('ParticipantsQuery', () => ({
      participants: [
        {
          __typename: 'Participant',
          id: 'p1',
          email: 'anna@example.com',
          name: 'Anna',
          familyName: 'Huber',
          birthdate: '2008-03-01',
          checkinConfirmed: false,
        },
      ],
    }))
    mockGraphQLQuery('ParticipantDetailQuery', (vars) => ({
      participant: {
        __typename: 'Participant',
        id: vars.id,
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
        price: null,
        bandColour: 'dark_green_ue16',
        eventId: 1,
        event: { __typename: 'Event', startDate: '2026-07-01', endDate: '2026-07-05' },
      },
    }))
  })

  it('navigates from the overview to the details and back', async () => {
    renderWithProviders(<CheckinView />, { withSidebar: true })

    const table = await screen.findByRole('table')
    fireEvent.click(within(table).getByRole('button', { name: /Checkin/ }))

    expect(await screen.findByDisplayValue('Huber')).toBeInTheDocument()
    expect(screen.getByText('Anna Huber')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Übersicht'))
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })
})
