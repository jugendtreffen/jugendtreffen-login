import { sendTemplateBrevoEmail } from 'src/lib/brevoMailer'

import { sendRegistrationConfirmation } from './mailer'

jest.mock('src/lib/brevoMailer', () => ({
  sendTemplateBrevoEmail: jest.fn().mockResolvedValue({ messageId: 'm1' }),
}))

describe('mailer', () => {
  it('sends the registration template with a link to the summary', async () => {
    await sendRegistrationConfirmation({
      to: 'anna@example.com',
      name: 'Anna',
      participantId: 'p-42',
    })

    expect(sendTemplateBrevoEmail).toHaveBeenCalledWith({
      to: 'anna@example.com',
      templateId: 4,
      subject: 'Du wurdest erfolgreich Registriert!',
      params: {
        summary_url: 'https://login.jugendtreffen.at/register-success/p-42',
      },
    })
  })
})
