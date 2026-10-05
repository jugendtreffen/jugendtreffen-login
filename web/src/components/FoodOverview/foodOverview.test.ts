import writeExcelFile from 'write-excel-file/browser'

import {
  buildFoodOverview,
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
      days.map(({ date, any, vegetarian, total }) => ({
        date,
        any,
        vegetarian,
        total,
      }))
    ).toEqual([
      { date: '2026-07-01', any: 1, vegetarian: 0, total: 1 },
      { date: '2026-07-02', any: 1, vegetarian: 1, total: 2 },
      { date: '2026-07-03', any: 2, vegetarian: 1, total: 3 },
    ])
    expect(days[0].label).toBe('Mi., 01.07.')
  })

  it('counts unknown food choices only in the total', () => {
    const [day] = buildFoodOverview([
      participant('vegan', '2026-07-01', '2026-07-01'),
    ])

    expect(day.total).toBe(1)
    expect(day.any).toBe(0)
    expect(day.vegetarian).toBe(0)
  })

  it('returns no days without participants', () => {
    expect(buildFoodOverview([])).toEqual([])
  })
})

describe('downloadFoodOverviewExcel', () => {
  it('writes a header row and one row per day', async () => {
    const days = buildFoodOverview([
      participant('vegetarian', '2026-07-01', '2026-07-02'),
    ])

    await downloadFoodOverviewExcel(days)

    const [rows] = (writeExcelFile as jest.Mock).mock.calls[0]
    expect(rows[0].map((cell) => cell.value)).toEqual([
      'Tag',
      'Alles',
      'Vegetarisch',
      'Gesamt',
    ])
    expect(rows.slice(1)).toEqual([
      ['Mi., 01.07.', 0, 1, 1],
      ['Do., 02.07.', 0, 1, 1],
    ])

    const { toFile } = (writeExcelFile as jest.Mock).mock.results[0].value
    expect(toFile).toHaveBeenCalledWith(
      expect.stringMatching(/^Essensuebersicht_\d{4}-\d{2}-\d{2}\.xlsx$/)
    )
  })
})
