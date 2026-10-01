import { act, fireEvent, render, screen } from '@redwoodjs/testing/web'

import { useAuth } from 'src/auth'

import { Dialog } from '@/components/ui/dialog'

import { SignupSuccessDialog } from './SignupSuccessDialog'

jest.mock('src/auth', () => ({ useAuth: jest.fn() }))

const renderDialog = () =>
  render(
    <Dialog open>
      <SignupSuccessDialog email="anna@example.com" />
    </Dialog>
  )

describe('SignupSuccessDialog', () => {
  let resend: jest.Mock

  beforeEach(() => {
    jest.useFakeTimers()
    resend = jest.fn().mockResolvedValue({ error: null })
    ;(useAuth as jest.Mock).mockReturnValue({ client: { auth: { resend } } })
  })

  afterEach(() => jest.useRealTimers())

  const waitSeconds = (s: number) =>
    act(() => {
      for (let i = 0; i < s; i++) jest.advanceTimersByTime(1000)
    })

  it('shows where the email was sent to', () => {
    renderDialog()
    expect(screen.getByText('anna@example.com')).toBeInTheDocument()
  })

  it('only allows resending after the cooldown', async () => {
    renderDialog()

    const button = screen.getByRole('button', { name: /Erneut senden in 60s/ })
    expect(button).toBeDisabled()

    waitSeconds(60)
    const resendButton = screen.getByRole('button', {
      name: 'Bestätigungs-E-Mail erneut senden',
    })
    expect(resendButton).toBeEnabled()

    await act(async () => {
      fireEvent.click(resendButton)
    })

    expect(resend).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'signup', email: 'anna@example.com' })
    )
    expect(
      screen.getByText('Bestätigungs-E-Mail wurde erneut gesendet.')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Erneut senden in 60s/ })
    ).toBeDisabled()
  })

  it('shows errors from supabase', async () => {
    resend.mockResolvedValue({ error: { message: 'Rate limit exceeded' } })
    renderDialog()
    waitSeconds(60)

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'Bestätigungs-E-Mail erneut senden' })
      )
    })

    expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument()
  })
})
