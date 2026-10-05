import { render, screen } from '@redwoodjs/testing/web'

import { useAuth } from 'src/auth'

import GlobalLayout from '@/layouts/GlobalLayout/GlobalLayout'

import HomePage from './HomePage'

jest.mock('src/auth', () => ({ useAuth: jest.fn() }))

const mockedUseAuth = useAuth as jest.Mock

const renderPage = () =>
  render(
    <GlobalLayout>
      <HomePage />
    </GlobalLayout>
  )

describe('HomePage', () => {
  beforeEach(() => {
    mockGraphQLQuery('FindCurrentEventQuery', () => ({
      currentEvent: {
        __typename: 'Event',
        id: '1',
        name: 'Jugendtreffen 2026',
        desc: null,
        startDate: '2026-07-01',
        endDate: '2026-07-05',
      },
    }))
  })

  it('shows the landing page with the current event dates for guests', async () => {
    mockedUseAuth.mockReturnValue({ loading: false, isAuthenticated: false })
    renderPage()

    expect(
      await screen.findByText(/1\. Juli bis 5\. Juli 2026 in Kremsmünster/)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Teilnehmen/ })).toBeInTheDocument()
  })

  it('shows the staff dashboard for logged in users', () => {
    mockedUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { id: '1', email: 'anna@example.com', roles: ['none'] },
      logOut: jest.fn(),
    })
    renderPage()

    expect(screen.getByRole('button', { name: 'Abmelden' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Join the Team' })).toBeInTheDocument()
  })

  it('shows a skeleton while auth is loading', () => {
    mockedUseAuth.mockReturnValue({ loading: true, isAuthenticated: false })
    renderPage()

    expect(screen.queryByRole('button', { name: /Teilnehmen/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Abmelden' })).not.toBeInTheDocument()
  })
})
