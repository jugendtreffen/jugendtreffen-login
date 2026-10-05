import { render, screen } from '@redwoodjs/testing/web'

import { CurrentEventProvider, useCurrentEvent } from './CurrenteventHook'

const EventName = () => {
  const { currentEvent, loading } = useCurrentEvent()
  if (loading) return <p>lädt</p>
  return <p>{currentEvent ? currentEvent.name : 'kein Event'}</p>
}

describe('useCurrentEvent', () => {
  it('throws outside of a CurrentEventProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<EventName />)).toThrow(
      'useCurrentEvent must be used within a CurrentEventProvider'
    )
  })

  it('provides the current event from the api', async () => {
    mockGraphQLQuery('FindCurrentEventQuery', () => ({
      currentEvent: {
        __typename: 'Event',
        id: 1,
        name: 'Jugendtreffen 2026',
        desc: null,
        startDate: '2026-07-01',
        endDate: '2026-07-05',
      },
    }))
    render(
      <CurrentEventProvider>
        <EventName />
      </CurrentEventProvider>
    )

    expect(await screen.findByText('Jugendtreffen 2026')).toBeInTheDocument()
  })

  it('provides null when there is no upcoming event', async () => {
    mockGraphQLQuery('FindCurrentEventQuery', () => ({ currentEvent: null }))
    render(
      <CurrentEventProvider>
        <EventName />
      </CurrentEventProvider>
    )

    expect(await screen.findByText('kein Event')).toBeInTheDocument()
  })
})
