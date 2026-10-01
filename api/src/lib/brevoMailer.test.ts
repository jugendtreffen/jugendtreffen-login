import { fetch } from '@whatwg-node/fetch'

import { sendRawBrevoEmail, sendTemplateBrevoEmail } from './brevoMailer'

jest.mock('@whatwg-node/fetch', () => ({ fetch: jest.fn() }))

const mockedFetch = fetch as jest.Mock

const okResponse = (body: unknown) => ({
  ok: true,
  json: async () => body,
})

describe('brevoMailer', () => {
  beforeEach(() => mockedFetch.mockReset())

  it('sends a template email via the Brevo API', async () => {
    mockedFetch.mockResolvedValue(okResponse({ messageId: 'm1' }))

    const result = await sendTemplateBrevoEmail({
      to: 'anna@example.com',
      templateId: 4,
      subject: 'Betreff',
      params: { summary_url: 'https://example.com' },
    })

    expect(result).toEqual({ messageId: 'm1' })
    const [url, init] = mockedFetch.mock.calls[0]
    expect(url).toBe('https://api.brevo.com/v3/smtp/email')
    expect(init.method).toBe('POST')
    expect(init.headers['api-key']).toBe(process.env.BREVO_API_KEY)
    expect(JSON.parse(init.body)).toEqual({
      sender: {
        email: 'anmeldung@jugendtreffen.at',
        name: 'Anmeldung@Jugendtreffen in Kremsmünster',
      },
      templateId: 4,
      params: { summary_url: 'https://example.com' },
      subject: 'Betreff',
      messageVersions: [{ to: [{ email: 'anna@example.com' }] }],
    })
  })

  it('sends a raw html email', async () => {
    mockedFetch.mockResolvedValue(okResponse({ messageId: 'm2' }))

    await sendRawBrevoEmail({
      to: 'anna@example.com',
      subject: 'Hallo',
      html: '<p>Hallo</p>',
      replyTo: 'team@example.com',
    })

    const body = JSON.parse(mockedFetch.mock.calls[0][1].body)
    expect(body.to).toEqual([{ email: 'anna@example.com' }])
    expect(body.htmlContent).toBe('<p>Hallo</p>')
    expect(body.replyTo).toEqual({ email: 'team@example.com' })
  })

  it('throws with the response details when Brevo rejects the request', async () => {
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: async () => 'invalid key',
    })

    await expect(
      sendTemplateBrevoEmail({ to: 'a@b.at', templateId: 4, subject: 'x' })
    ).rejects.toThrow('Brevo Template request failed: 401 Unauthorized invalid key')
  })
})
