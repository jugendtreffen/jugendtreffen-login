import writeExcelFile from 'write-excel-file/browser'

import {
  buildFoodOverview,
  downloadFoodOverviewExcel,
  formatPeriod,
  getDays,
  sortIntolerances,
} from './foodOverview'

jest.mock('write-excel-file/browser', () => {
  const toFile = jest.fn().mockResolvedValue(undefined)
  return { __esModule: true, default: jest.fn(() => ({ toFile })) }
})

const participant = (
  foodChoice: string,
  startDate: string,
  endDate: string
) => ({
  foodChoice,
  startDate: `${startDate}T00:00:00.000Z`,
  endDate: `${endDate}T00:00:00.000Z`,
})

describe('getDays', () => {
  it('returns every day including start and end', () => {
    expect(
      getDays('2026-06-30T00:00:00.000Z', '2026-07-02T00:00:00.000Z')
    ).toEqual(['2026-06-30', '2026-07-01', '2026-07-02'])
  })

  it('returns a single day when start equals end', () => {
    expect(getDays('2026-07-01', '2026-07-01')).toEqual(['2026-07-01'])
  })
})

describe('buildFoodOverview', () => {
  it('counts the food choices of all participants per day', () => {
    const days = buildFoodOverview([
      participant('any', '2026-07-01', '2026-07-03'),
      participant('vegetarian', '2026-07-02', '2026-07-03'),
      participant('any', '2026-07-03', '2026-07-03'),
    ])

    expect(
      days.map(({ date, meals }) => ({ date, lunch: meals.lunch }))
    ).toEqual([
      { date: '2026-07-01', lunch: { any: 1, vegetarian: 0, total: 1 } },
      { date: '2026-07-02', lunch: { any: 1, vegetarian: 1, total: 2 } },
      { date: '2026-07-03', lunch: { any: 2, vegetarian: 1, total: 3 } },
    ])
    expect(days[0].label).toBe('Mi., 01.07.')
  })

  it('uses the daily count for breakfast, lunch and dinner', () => {
    const [day] = buildFoodOverview([
      participant('vegetarian', '2026-07-01', '2026-07-01'),
    ])

    const expected = { any: 0, vegetarian: 1, total: 1 }
    expect(day.meals).toEqual({
      breakfast: expected,
      lunch: expected,
      dinner: expected,
    })
  })

  it('counts unknown food choices only in the total', () => {
    const [day] = buildFoodOverview([
      participant('vegan', '2026-07-01', '2026-07-01'),
    ])

    expect(day.meals.lunch).toEqual({ any: 0, vegetarian: 0, total: 1 })
  })

  it('returns no days without participants', () => {
    expect(buildFoodOverview([])).toEqual([])
  })
})

const person = (name: string, familyName: string, intolerances: string[]) => ({
  name,
  familyName,
  intolerances,
  startDate: '2026-07-01T00:00:00.000Z',
  endDate: '2026-07-05T00:00:00.000Z',
})

describe('intolerances', () => {
  it('formats the period of stay', () => {
    expect(formatPeriod('2026-07-01', '2026-07-05')).toBe('01.07. – 05.07.')
  })

  it('sorts by family name and skips people without intolerance', () => {
    const sorted = sortIntolerances([
      person('Ben', 'Gruber', ['Gluten']),
      person('Eva', 'Maier', []),
      person('Anna', 'Berger', ['Laktose']),
    ])

    expect(sorted.map(({ familyName }) => familyName)).toEqual([
      'Berger',
      'Gruber',
    ])
  })
})

describe('downloadFoodOverviewExcel', () => {
  it('writes the meals and the intolerances into two sheets', async () => {
    const days = buildFoodOverview([
      participant('vegetarian', '2026-07-01', '2026-07-02'),
    ])

    await downloadFoodOverviewExcel(days, [
      person('Ben', 'Gruber', ['Gluten', 'Nüsse']),
    ])

    const [[meals, intolerances]] = (writeExcelFile as jest.Mock).mock.calls[0]
    const values = (rows) =>
      rows.map((row) => row.map((cell) => cell?.value ?? cell))

    expect(meals.sheet).toBe('Essensübersicht')
    expect(values(meals.data)).toEqual([
      ['Tag', 'Mahlzeit', 'Alles', 'Vegetarisch', 'Gesamt'],
      ['Mi., 01.07.', 'Frühstück', 0, 1, 1],
      ['Mi., 01.07.', 'Mittagessen', 0, 1, 1],
      ['Mi., 01.07.', 'Abendessen', 0, 1, 1],
      ['Do., 02.07.', 'Frühstück', 0, 1, 1],
      ['Do., 02.07.', 'Mittagessen', 0, 1, 1],
      ['Do., 02.07.', 'Abendessen', 0, 1, 1],
    ])

    expect(intolerances.sheet).toBe('Unverträglichkeiten')
    expect(values(intolerances.data)).toEqual([
      ['Name', 'Unverträglichkeiten', 'Zeitraum'],
      ['Ben Gruber', 'Gluten, Nüsse', '01.07. – 05.07.'],
    ])

    const { toFile } = (writeExcelFile as jest.Mock).mock.results[0].value
    expect(toFile).toHaveBeenCalledWith(
      expect.stringMatching(/^Essensuebersicht_\d{4}-\d{2}-\d{2}\.xlsx$/)
    )
  })
})
