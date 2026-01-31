import mailchimp from '@mailchimp/mailchimp_transactional'

// Initialisiere den Mailchimp Client mit deinem API Key
export const mailchimpClient = mailchimp(process.env.MAILCHIMP_API_KEY)
