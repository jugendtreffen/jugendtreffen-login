import { render, screen } from '@redwoodjs/testing/web'

import { useAuth } from 'src/auth'

import { AlertProvider } from '@/hooks/AlertHook'

import VerifySignupPage from './VerifySignupPage'

jest.mock('src/auth', () => ({ useAuth: jest.fn() }))

const mockedUseAuth = useAuth as jest.Mock

const renderPage = (props = {}) =>
  render(
    <AlertProvider>
      <VerifySignupPage {...props} />
    </AlertProvider>
  )

describe('VerifySignupPage', () => {
  let verifyOtp: jest.Mock

  beforeEach(() => {
    verifyOtp = jest.fn().mockResolvedValue({ error: null })
    mockedUseAuth.mockReturnValue({
      client: { auth: { verifyOtp } },
      isAuthenticated: false,
    })
  })

  it('shows an error when no token is given', async () => {
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Bestätigungslink nicht gültig'
    )
    expect(verifyOtp).not.toHaveBeenCalled()
  })

  it('verifies the token and shows a success message', async () => {
    renderPage({ token_hash: 'abc123' })

    expect(
      await screen.findByText('Deine Email wurde erfolgreich bestätigt!')
    ).toBeInTheDocument()
    expect(verifyOtp).toHaveBeenCalledWith({
      token_hash: 'abc123',
      type: 'email',
    })
  })

  it('shows the error message returned by supabase', async () => {
    verifyOtp.mockResolvedValue({ error: { message: 'Token has expired' } })
    renderPage({ token_hash: 'abc123' })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Token has expired'
    )
  })
})
