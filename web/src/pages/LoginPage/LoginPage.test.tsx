import { navigate } from '@redwoodjs/router'
import { fireEvent, render, screen, waitFor } from '@redwoodjs/testing/web'

import { useAuth } from 'src/auth'

import { AlertProvider } from '@/hooks/AlertHook'

import LoginPage from './LoginPage'

jest.mock('src/auth', () => ({ useAuth: jest.fn() }))
jest.mock('@redwoodjs/router', () => ({
  ...jest.requireActual('@redwoodjs/router'),
  navigate: jest.fn(),
}))

const mockedUseAuth = useAuth as jest.Mock

const renderPage = (props = {}) =>
  render(
    <AlertProvider>
      <LoginPage {...props} />
    </AlertProvider>
  )

const fillAndSubmit = async (email: string, password: string) => {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Passwort'), {
    target: { value: password },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Login' }))
}

describe('LoginPage', () => {
  let logIn: jest.Mock

  beforeEach(() => {
    logIn = jest.fn().mockResolvedValue({})
    mockedUseAuth.mockReturnValue({
      logIn,
      isAuthenticated: false,
      currentUser: null,
    })
    ;(navigate as jest.Mock).mockClear()
  })

  it('renders the login form', () => {
    renderPage()
    expect(screen.getByText('Bei Jugendtreffen Anmelden')).toBeInTheDocument()
    expect(screen.getByLabelText('Passwort')).toHaveAttribute('type', 'password')
  })

  it('logs in with email and password and navigates home', async () => {
    renderPage()
    await fillAndSubmit('anna@example.com', 'geheim123')

    await waitFor(() =>
      expect(logIn).toHaveBeenCalledWith({
        email: 'anna@example.com',
        password: 'geheim123',
        authMethod: 'password',
      })
    )
    expect(logIn).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('navigates to the "next" url after login', async () => {
    renderPage({ next: '/register' })
    await fillAndSubmit('anna@example.com', 'geheim123')

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/register'))
  })

  it('shows the error returned by supabase', async () => {
    logIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } })
    renderPage()
    await fillAndSubmit('anna@example.com', 'falsch')

    expect(
      await screen.findByText('Invalid login credentials')
    ).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('validates the email address', async () => {
    renderPage()
    await fillAndSubmit('keine-email', 'geheim123')

    expect(
      await screen.findByText('Bitte gib deine Email-Adresse an')
    ).toBeInTheDocument()
    expect(logIn).not.toHaveBeenCalled()
  })

  it('shows the current user when already logged in', () => {
    mockedUseAuth.mockReturnValue({
      logIn,
      isAuthenticated: true,
      currentUser: { email: 'anna@example.com' },
    })
    renderPage()

    expect(screen.getByText('Angemeldet als')).toBeInTheDocument()
    expect(screen.getByText('anna@example.com')).toBeInTheDocument()
  })
})
