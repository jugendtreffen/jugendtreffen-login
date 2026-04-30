import { fetch } from '@whatwg-node/fetch'

const apiKey = process.env.BREVO_API_KEY
if (!apiKey) {
  throw new Error('BREVO_API_KEY is not set')
}

const baseURL = process.env.BREVO_API_BASE_URL ?? 'https://api.brevo.com/v3'
const senderEmail =
  process.env.BREVO_SENDER_EMAIL ?? 'anmeldung@jugendtreffen.at'
const senderName =
  process.env.BREVO_SENDER_NAME ?? 'Anmeldung@Jugendtreffen in Kremsmünster'

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendRawBrevoEmail(input: SendEmailInput) {
  const { to, subject, html, text, replyTo } = input

  const payload = {
    sender: {
      email: senderEmail,
      name: senderName,
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text,
    replyTo: replyTo
      ? {
          email: replyTo,
        }
      : undefined,
  }

  const response = await fetch(`${baseURL}/smtp/email`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '')
    throw new Error(
      `Brevo request failed: ${response.status} ${response.statusText} ${bodyText}`
    )
  }

  return await response.json()
}

export type TemplateEmailInput = {
  to: string
  templateId: number
  subject: string
  params?: Record<string, string>
}

export async function sendTemplateBrevoEmail(input: TemplateEmailInput) {
  const { to, templateId, subject } = input

  const response = await fetch(`${baseURL}/smtp/email`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: senderName,
      },
      templateId: templateId,
      params: input.params,
      subject: subject,
      messageVersions: [
        {
          to: [{ email: to }],
        },
      ],
    }),
  })

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '')
    throw new Error(
      `Brevo Template request failed: ${response.status} ${response.statusText} ${bodyText}`
    )
  }

  return await response.json()
}
