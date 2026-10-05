import { fireEvent, render, screen, waitFor } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'

import { Empty, Failure, Loading, Success } from './StaffCell'
import { standard } from './StaffCell.mock'

const renderWithAlert = (ui: React.ReactElement) =>
  render(<AlertProvider>{ui}</AlertProvider>)

describe('StaffCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty with a message', () => {
    renderWithAlert(<Empty />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Keine Benutzer gefunden.'
    )
  })

  it('renders Failure with the error message', () => {
    renderWithAlert(<Failure error={new Error('Oh no')} />)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Fehler beim Laden der Benutzer: Oh no'
    )
  })

  it('renders one role form per staff user', () => {
    renderWithAlert(<Success staffUsers={standard().staffUsers} />)

    expect(screen.getByText('anna@example.com')).toBeInTheDocument()
    expect(screen.getByText('ben@example.com')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Speichern/ })).toHaveLength(2)
  })

  it('updates a role and shows a success message', async () => {
    const mutation = jest.fn((vars) => ({
      updateStaffRole: {
        __typename: 'StaffUser',
        id: vars.input.userId,
        email: 'ben@example.com',
        role: vars.input.role,
      },
    }))
    mockGraphQLMutation('UpdateStaffRoleMutation', mutation)
    mockGraphQLQuery('StaffUsersQuery', () => standard())
    renderWithAlert(<Success staffUsers={standard().staffUsers} />)

    fireEvent.click(screen.getAllByRole('combobox')[1])
    fireEvent.click(screen.getByRole('option', { name: 'Check-in' }))
    fireEvent.click(screen.getAllByTitle('Speichern')[1])

    await waitFor(() =>
      expect(mutation).toHaveBeenCalledWith(
        { input: { userId: 'u2', role: 'checkin' } },
        expect.anything()
      )
    )
    expect(
      await screen.findByText('Rolle erfolgreich aktualisiert')
    ).toBeInTheDocument()
  })
})
