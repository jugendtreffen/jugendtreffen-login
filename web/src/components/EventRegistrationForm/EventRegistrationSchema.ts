import { z } from 'zod'

const getCutoffBirthdate = () => {
  const currentYear = new Date().getFullYear()
  return new Date(currentYear - 13, 6, 1) // 1. Juli, Monat 6 = Juli
}

export const RegistrationSchema = z
  .object({
    name: z.string().min(1, 'Bitte gib deinen Vornamen an'),
    familyName: z.string().min(1, 'Bitte gib deinen Nachnamen an'),
    email: z.email('Bitte gib eine gültige E-Mail-Adresse ein'),
    birthdate: z.coerce.date().refine((date) => date <= getCutoffBirthdate(), {
      message: 'Du musst am 1. Juli des aktuellen Jahres mindestens 13 Jahre alt sein.'
    }),
    gender: z.string().min(1, 'Geschlecht darf nicht leer sein'),
    phoneNumber: z.string().min(1, 'Telefonnummer darf nicht leer sein'),
    phoneCaretakerContact: z.string().optional().nullable(),
    foundUsBy: z.string().optional().nullable(),
    isParent: z.boolean().optional().nullable(),
    country: z.string().min(1, 'Land darf nicht leer sein'),
    city: z.string().min(1, 'Stadt darf nicht leer sein'),
    postalCode: z.string().min(1, 'Postleitzahl darf nicht leer sein'),
    address: z.string().min(1, 'Adresse darf nicht leer sein'),
    travelMethod: z.string(),
    accommodation: z.string().min(1, 'Unterkunft darf nicht leer sein'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    foodChoice: z.string().min(1, 'Essenswunsch darf nicht leer sein'),
    acceptPhotos: z.boolean(),
    acceptCoC: z.literal(true),
    participationRole: z.string().min(1, 'Teilnahmerolle darf nicht leer sein'),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Das Enddatum darf nicht vor dem Startdatum liegen',
    path: ['endDate'],
  })

export type RegistrationInput = z.infer<typeof RegistrationSchema>
