import { fireEvent, screen } from '@redwoodjs/testing/web'

import { renderWithProviders } from '@/test/renderWithProviders'

import ViewRouter from './ViewRouter'

describe('ViewRouter', () => {
  beforeEach(() => {
    mockGraphQLQuery('ParticipantsQuery', () => ({ participants: [] }))
    mockGraphQLQuery('DashboardParticipantsQuery', () => ({ participants: [] }))
    mockGraphQLQuery('StaffUsersQuery', () => ({ staffUsers: [] }))
  })

  it('shows "Join the Team" by default', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['none'] })
    renderWithProviders(<ViewRouter />, { withSidebar: true })

    expect(
      screen.getByText('Du bist noch nicht als Mitarbeiter aufgenommen!')
    ).toBeInTheDocument()
  })

  it.each([
    ['Checkin', 'Eine Übersicht aller Teilnehmer', 'checkin'],
    ['Mitarbeiter', 'Mitarbeiter verwalten', 'admin'],
    ['Dashboard', 'Admin Dashboard', 'admin'],
  ])('switches to the %s view', async (item, text, role) => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: [role] })
    renderWithProviders(<ViewRouter />, { withSidebar: true })

    fireEvent.click(screen.getByRole('button', { name: item }))

    expect(await screen.findByText(new RegExp(text))).toBeInTheDocument()
  })

  it('shows the Quartier view for quartier roles', async () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['quartier_boys'] })
    renderWithProviders(<ViewRouter />, { withSidebar: true })

    fireEvent.click(screen.getByRole('button', { name: 'Quartier' }))

    expect(await screen.findByText('Quartier tbd')).toBeInTheDocument()
  })
})
