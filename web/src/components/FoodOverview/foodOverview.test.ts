import writeExcelFile from 'write-excel-file/browser'

import {
  buildFoodOverview,
  buildIntoleranceDays,
  downloadFoodOverviewExcel,
  getDays,
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

const person = (
  intolerances: string[],
  startDate: string,
  endDate: string
) => ({
  intolerances,
  startDate: `${startDate}T00:00:00.000Z`,
  endDate: `${endDate}T00:00:00.000Z`,
})

describe('buildIntoleranceDays', () => {
  it('counts the intolerances of everyone present per day', () => {
    const days = buildIntoleranceDays([
      person(['Laktose'], '2026-07-01', '2026-07-02'),
      person(['Gluten', 'Laktose'], '2026-07-02', '2026-07-02'),
    ])

    expect(days).toEqual([
      {
        date: '2026-07-01',
        label: 'Mi., 01.07.',
        counts: [{ intolerance: 'Laktose', count: 1 }],
      },
      {
        date: '2026-07-02',
        label: 'Do., 02.07.',
        counts: [
          { intolerance: 'Laktose', count: 2 },
          { intolerance: 'Gluten', count: 1 },
        ],
      },
    ])
  })

  it('sorts equal counts alphabetically', () => {
    const [day] = buildIntoleranceDays([
      person(['Nüsse', 'Ei'], '2026-07-01', '2026-07-01'),
    ])
    expect(day.counts.map(({ intolerance }) => intolerance)).toEqual([
      'Ei',
      'Nüsse',
    ])
  })

  it('skips people without intolerances', () => {
    expect(
      buildIntoleranceDays([person([], '2026-07-01', '2026-07-03')])
    ).toEqual([])
  })
})

describe('downloadFoodOverviewExcel', () => {
  it('writes the meals and the intolerances into two sheets', async () => {
    const days = buildFoodOverview([
      participant('vegetarian', '2026-07-01', '2026-07-02'),
    ])

    await downloadFoodOverviewExcel(
      days,
      buildIntoleranceDays([
        person(['Gluten', 'Nüsse'], '2026-07-01', '2026-07-01'),
      ])
    )

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
      ['Tag', 'Unverträglichkeit', 'Anzahl'],
      ['Mi., 01.07.', 'Gluten', 1],
      ['Mi., 01.07.', 'Nüsse', 1],
    ])

    const { toFile } = (writeExcelFile as jest.Mock).mock.results[0].value
    expect(toFile).toHaveBeenCalledWith(
      expect.stringMatching(/^Essensuebersicht_\d{4}-\d{2}-\d{2}\.xlsx$/)
    )
  })
})
