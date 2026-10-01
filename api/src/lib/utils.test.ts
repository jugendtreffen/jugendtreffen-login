import { getAge } from './utils'

describe('getAge', () => {
  const cutoff = new Date('2026-07-01T00:00:00.000Z')

  it.each([
    ['2008-07-01', 18],
    ['2008-07-02', 17],
    ['2008-06-30', 18],
    ['2010-12-31', 15],
    ['2012-01-01', 14],
  ])('person born %s is %i at the cutoff', (birthdate, expected) => {
    expect(getAge(new Date(`${birthdate}T00:00:00.000Z`), cutoff)).toBe(expected)
  })

  it('uses today as default cutoff', () => {
    const tenYearsAgo = new Date()
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
    expect(getAge(tenYearsAgo)).toBe(10)
  })
})
