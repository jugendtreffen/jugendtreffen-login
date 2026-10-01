import { RegistrationSchema } from './EventRegistrationSchema'

const currentYear = new Date().getFullYear()

const validInput = () => ({
  name: 'Max',
  familyName: 'Mustermann',
  email: 'max@example.com',
  birthdate: new Date(currentYear - 16, 0, 1),
  gender: 'male',
  phoneNumber: '+43 660 1234567',
  country: 'AT',
  city: 'Kremsmünster',
  postalCode: '4550',
  address: 'Stiftsplatz 1',
  travelMethod: 'train',
  accommodation: 'jugendtreffen',
  startDate: new Date(currentYear, 6, 1),
  endDate: new Date(currentYear, 6, 5),
  foodChoice: 'any',
  acceptPhotos: true,
  acceptCoC: true,
  participationRole: 'teilnehmer',
})

const errorsFor = (input: Record<string, unknown>) => {
  const result = RegistrationSchema.safeParse(input)
  return result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map((issue) => [issue.path.join('.'), issue.message])
      )
}

describe('RegistrationSchema', () => {
  it('accepts a complete registration', () => {
    expect(RegistrationSchema.safeParse(validInput()).success).toBe(true)
  })

  it('requires the personal fields', () => {
    const errors = errorsFor({ ...validInput(), name: '', familyName: '' })
    expect(errors.name).toBe('Bitte gib deinen Vornamen an')
    expect(errors.familyName).toBe('Bitte gib deinen Nachnamen an')
  })

  it('rejects an invalid email', () => {
    expect(errorsFor({ ...validInput(), email: 'keine-email' }).email).toBe(
      'Bitte gib eine gültige E-Mail-Adresse ein'
    )
  })

  it('accepts participants who are 13 on the 1st of July', () => {
    const input = { ...validInput(), birthdate: new Date(currentYear - 13, 6, 1) }
    expect(errorsFor(input).birthdate).toBeUndefined()
  })

  it('rejects participants younger than 13 on the 1st of July', () => {
    const input = { ...validInput(), birthdate: new Date(currentYear - 13, 6, 2) }
    expect(errorsFor(input).birthdate).toMatch(/mindestens 13 Jahre/)
  })

  it('rejects an end date before the start date', () => {
    const input = {
      ...validInput(),
      startDate: new Date(currentYear, 6, 5),
      endDate: new Date(currentYear, 6, 1),
    }
    expect(errorsFor(input).endDate).toBe(
      'Das Enddatum darf nicht vor dem Startdatum liegen'
    )
  })

  it('requires consent to photos and the code of conduct', () => {
    const errors = errorsFor({
      ...validInput(),
      acceptPhotos: false,
      acceptCoC: false,
    })
    expect(errors.acceptPhotos).toBe(
      'Zustimmung zu Fotos und Videos ist verpflichtend'
    )
    expect(errors.acceptCoC).toBe('Der Verhaltenscodex muss akzeptiert werden')
  })

  it('coerces ISO date strings', () => {
    const input = { ...validInput(), startDate: `${currentYear}-07-01` }
    const result = RegistrationSchema.safeParse(input)
    expect(result.success).toBe(true)
    expect(result.success && result.data.startDate).toBeInstanceOf(Date)
  })
})
