import {sendTemplateBrevoEmail} from "src/lib/brevoMailer";

interface EmailParams {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
}

export type WelcomeEmailInput = {
  to: string
  name: string
}

export async function sendRegistrationConfirmation({
                                         to,
                                         name,
                                       }: WelcomeEmailInput) {
  const templateId = 4

  return sendTemplateBrevoEmail({
    to,
    templateId,
  })
}
