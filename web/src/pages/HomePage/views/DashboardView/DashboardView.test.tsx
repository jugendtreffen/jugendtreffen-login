import { render, screen, within } from '@redwoodjs/testing/web'

import DashboardView from './DashboardView'

const participant = (
  id: string,
  gender: string,
  participationRole: string | null
) => ({
  __typename: 'Participant',
  id,
  birthdate: '2008-01-01',
  gender,
  accommodation: 'jugendtreffen',
  startDate: '2026-07-01',
  endDate: '2026-07-03',
  foodChoice: 'any',
  participationRole,
})

const kpi = (label: string) =>
  within(screen.getByText(label).parentElement as HTMLElement)

describe('DashboardView', () => {
  it('shows key figures of all participants', async () => {
    mockGraphQLQuery('DashboardParticipantsQuery', () => ({
      participants: [
        participant('1', 'male', 'teilnehmer'),
        participant('2', 'female', 'teilnehmer'),
        participant('3', 'female', 'begleitperson'),
        participant('4', 'male', 'priester'),
      ],
    }))
    render(<DashboardView />)

    expect(await screen.findByText('Admin Dashboard')).toBeInTheDocument()
    expect(kpi('Gesamt').getByText('4')).toBeInTheDocument()
    expect(kpi('Burschen').getByText('2')).toBeInTheDocument()
    expect(kpi('Mädchen').getByText('2')).toBeInTheDocument()
    expect(kpi('Priester / Ordens / Vortr.').getByText('1')).toBeInTheDocument()
    expect(screen.getByText('25.0 %')).toBeInTheDocument()
  })

  it('handles an empty participant list', async () => {
    mockGraphQLQuery('DashboardParticipantsQuery', () => ({ participants: [] }))
    render(<DashboardView />)

    expect(await screen.findByText('0.0 %')).toBeInTheDocument()
  })

  it('shows api errors', async () => {
    mockGraphQLQuery('DashboardParticipantsQuery', () => {
      throw new Error('Kein Zugriff')
    })
    render(<DashboardView />)

    expect(await screen.findByText(/Fehler:/)).toBeInTheDocument()
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
  })
})
