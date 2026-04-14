import { mailchimpClient } from "src/lib/mailchimp";
import { logger } from "src/lib/logger";

interface EmailParams {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from = process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com',
}: EmailParams) => {
  try {
    const message = {
      from_email: from,
      subject: subject,
      text: text || '',
      html: html || '',
      to: [
        {
          email: to,
          type: 'to',
        },
      ],
    }

    const response = await mailchimpClient.messages.send({
      message,
    })

    logger.info({ response }, 'Email sent successfully')
    return response
  } catch (error) {
    logger.error({ error }, 'Failed to send email')
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

// Template-basierter Email-Versand
export const sendTemplateEmail = async ({
  to,
  templateName,
  templateContent,
  from = process.env.DEFAULT_FROM_EMAIL,
}: {
  to: string
  templateName: string
  templateContent: Array<{ name: string; content: string }>
  from?: string
}) => {
  try {
    const message = {
      from_email: from,
      to: [
        {
          email: to,
          type: 'to',
        },
      ],
    }

    const response = await mailchimpClient.messages.sendTemplate({
      template_name: templateName,
      template_content: templateContent,
      message,
    })

    logger.info({ response }, 'Template email sent successfully')
    return response
  } catch (error) {
    logger.error({ error }, 'Failed to send template email')
    throw new Error(`Template email sending failed: ${error.message}`)
  }
}
