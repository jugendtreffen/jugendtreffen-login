import { render, screen } from '@redwoodjs/testing/web'

import { standard } from '@/components/RegistrationOverviewCell/RegistrationOverviewCell.mock'
import { AlertProvider } from '@/hooks/AlertHook'

import RegistrationSuccessPage from './RegistrationSuccessPage'

describe('RegistrationSuccessPage', () => {
  it('loads and shows the registration with the id from the url', async () => {
    const query = jest.fn(() => standard())
    mockGraphQLQuery('FindParticipantQuery', query)

    render(
      <AlertProvider>
        <RegistrationSuccessPage id="42" />
      </AlertProvider>
    )

    expect(await screen.findByText('Anmeldung erfolgreich!')).toBeInTheDocument()
    expect(query).toHaveBeenCalledWith({ id: '42' }, expect.anything())
  })

  it('shows a not-found message for unknown ids', async () => {
    mockGraphQLQuery('FindParticipantQuery', () => ({ participant: null }))

    render(
      <AlertProvider>
        <RegistrationSuccessPage id="unbekannt" />
      </AlertProvider>
    )

    expect(
      await screen.findByText(/Anmeldung nicht gefunden/)
    ).toBeInTheDocument()
  })
})
