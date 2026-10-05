import { render, screen } from '@redwoodjs/testing/web'

import { standard } from '@/components/CurrentEventCell/CurrentEventCell.mock'
import { AlertProvider } from '@/hooks/AlertHook'

import EventRegistrationPage from './EventRegistrationPage'

const renderPage = () =>
  render(
    <AlertProvider>
      <EventRegistrationPage />
    </AlertProvider>
  )

describe('EventRegistrationPage', () => {
  it('shows the registration form for the current event', async () => {
    mockGraphQLQuery('FindCurrentEventQuery', () => standard())
    renderPage()

    expect(
      await screen.findByText('Anmeldung Jugendtreffen 2026')
    ).toBeInTheDocument()
  })

  it('tells the user when no event is upcoming', async () => {
    mockGraphQLQuery('FindCurrentEventQuery', () => ({ currentEvent: null }))
    renderPage()

    expect(await screen.findByText('Kein anstehendes Event')).toBeInTheDocument()
  })
})
