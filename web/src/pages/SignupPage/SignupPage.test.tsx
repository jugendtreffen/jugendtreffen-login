import { fireEvent, render, screen, waitFor } from '@redwoodjs/testing/web'

import { useAuth } from 'src/auth'

import { AlertProvider } from '@/hooks/AlertHook'

import SignupPage from './SignupPage'

jest.mock('src/auth', () => ({ useAuth: jest.fn() }))

const mockedUseAuth = useAuth as jest.Mock

const renderPage = () =>
  render(
    <AlertProvider>
      <SignupPage />
    </AlertProvider>
  )

const fillAndSubmit = (password: string, confirmPassword: string) => {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'anna@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Passwort'), {
    target: { value: password },
  })
  fireEvent.change(screen.getByLabelText('Passwort Bestätigen'), {
    target: { value: confirmPassword },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))
}

describe('SignupPage', () => {
  let signUp: jest.Mock

  beforeEach(() => {
    signUp = jest.fn().mockResolvedValue({ data: {}, error: null })
    mockedUseAuth.mockReturnValue({
      client: { auth: { signUp, resend: jest.fn() } },
      isAuthenticated: false,
      currentUser: null,
    })
  })

  it('renders the signup form', () => {
    renderPage()
    expect(screen.getByLabelText('Passwort Bestätigen')).toBeInTheDocument()
  })

  it('signs up via supabase and opens the success dialog', async () => {
    renderPage()
    fillAndSubmit('geheim123', 'geheim123')

    await waitFor(() =>
      expect(signUp).toHaveBeenCalledWith({
        email: 'anna@example.com',
        password: 'geheim123',
      })
    )
    expect(signUp).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('dialog')).toHaveTextContent(
      'anna@example.com'
    )
  })

  it('rejects mismatching passwords', async () => {
    renderPage()
    fillAndSubmit('geheim123', 'anders123')

    expect(
      await screen.findByText('Die Passwörter stimmen nicht überein')
    ).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('shows the error returned by supabase', async () => {
    signUp.mockResolvedValue({ error: { message: 'User already registered' } })
    renderPage()
    fillAndSubmit('geheim123', 'geheim123')

    expect(
      await screen.findByText('User already registered')
    ).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the current user when already logged in', () => {
    mockedUseAuth.mockReturnValue({
      client: undefined,
      isAuthenticated: true,
      currentUser: { email: 'anna@example.com' },
    })
    renderPage()
    expect(screen.getByText('Angemeldet als')).toBeInTheDocument()
  })
})
