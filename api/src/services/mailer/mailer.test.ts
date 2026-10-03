import { sendRegistrationConfirmation } from './mailer'
import { sendTemplateBrevoEmail } from 'src/lib/brevoMailer'

jest.mock('src/lib/brevoMailer', () => ({
  sendTemplateBrevoEmail: jest.fn(),
}))

describe('mailer', () => {
  it('sends a registration confirmation using the Brevo template', async () => {
    const mockSendTemplateBrevoEmail = jest.mocked(sendTemplateBrevoEmail)
    mockSendTemplateBrevoEmail.mockResolvedValue({ messageId: 'msg-123' } as any)

    const result = await sendRegistrationConfirmation({
      to: 'participant@example.com',
      name: 'Ada',
      participantId: 'participant-42',
    })

    expect(mockSendTemplateBrevoEmail).toHaveBeenCalledWith({
      to: 'participant@example.com',
      templateId: 4,
      subject: 'Du wurdest erfolgreich Registriert!',
      params: {
        summary_url: 'https://login.jugendtreffen.at/register-success/participant-42',
      },
    })
    expect(result).toEqual({ messageId: 'msg-123' })
  })
})
