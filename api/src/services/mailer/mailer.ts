import {sendTemplateBrevoEmail} from "src/lib/brevoMailer";

export type WelcomeEmailInput = {
    to: string
    name: string
}

export async function sendRegistrationConfirmation({to, name}: WelcomeEmailInput) {
    const registrationTemplateId = 4
    const registrationSubject = "Du wurdest erfolgreich Registriert!"

    return sendTemplateBrevoEmail({
        to: to,
        templateId: registrationTemplateId,
        subject: registrationSubject
    })
}
