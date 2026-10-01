import {
  calculateDuration,
  formatAccomodation,
  formatCountry,
  formatDayMonth,
  formatFoodChoice,
  formatGender,
  formatParticipationRole,
  formatTravelMethod,
  formatYear,
} from './utils'

describe('utils', () => {
  it('calculates the duration in days', () => {
    expect(
      calculateDuration(new Date('2026-06-28'), new Date('2026-07-03'))
    ).toBe(5)
    expect(
      calculateDuration(new Date('2026-07-03'), new Date('2026-06-28'))
    ).toBe(5)
  })

  it('formats day/month and year in UTC', () => {
    expect(formatDayMonth('2026-07-01T00:00:00.000Z')).toBe('1. Juli')
    expect(formatYear('2026-07-01T00:00:00.000Z')).toBe('2026')
  })

  it('returns an empty string for invalid dates', () => {
    expect(formatDayMonth('kein datum')).toBe('')
    expect(formatYear(undefined)).toBe('')
  })

  it.each([
    [formatGender, 'male', 'Männlich'],
    [formatGender, 'female', 'Weiblich'],
    [formatGender, 'x', '-'],
    [formatCountry, 'AT', 'Österreich'],
    [formatCountry, '--', 'Sonstiges'],
    [formatCountry, 'US', '-'],
    [formatTravelMethod, 'car', 'Auto'],
    [formatTravelMethod, 'train', 'Zug'],
    [formatTravelMethod, null, '-'],
    [formatAccomodation, 'subiaco', 'Haus Subiaco'],
    [formatAccomodation, 'private', 'unabhängig vom Jugendtreffen'],
    [formatFoodChoice, 'vegetarian', 'Vegetarisch'],
    [formatFoodChoice, 'any', 'Nicht Wählerisch'],
    [formatParticipationRole, 'priester', '(Ordens-)Priester'],
    [formatParticipationRole, 'begleitperson', 'Begleitperson'],
    [formatParticipationRole, 'unbekannt', undefined],
  ])('%p(%p) → %p', (format, value, expected) => {
    expect((format as (v: unknown) => unknown)(value)).toBe(expected)
  })
})
