import { sendTemplateBrevoEmail } from 'src/lib/brevoMailer'

export type WelcomeEmailInput = {
  to: string
  name: string
  participantId: string
}

export async function sendRegistrationConfirmation(input: WelcomeEmailInput) {
  const registrationTemplateId = 4
  const registrationSubject = 'Du wurdest erfolgreich Registriert!'

  return sendTemplateBrevoEmail({
    to: input.to,
    templateId: registrationTemplateId,
    subject: registrationSubject,
    params: { "summary_url": `https://login.jugendtreffen.at/register-success/${input.participantId}` },
  })
}
