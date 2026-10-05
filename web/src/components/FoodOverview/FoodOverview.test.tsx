import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'
import FoodOverview from './FoodOverview'
import { downloadFoodOverviewExcel } from './foodOverview'

jest.mock('./foodOverview', () => ({
  ...jest.requireActual('./foodOverview'),
  downloadFoodOverviewExcel: jest.fn().mockResolvedValue(undefined),
}))

const mockedDownload = downloadFoodOverviewExcel as jest.Mock

const participants = [
  { foodChoice: 'any', startDate: '2026-07-01', endDate: '2026-07-02' },
  { foodChoice: 'vegetarian', startDate: '2026-07-02', endDate: '2026-07-02' },
]

const intolerances = [
  {
    intolerances: ['Gluten', 'Laktose'],
    startDate: '2026-07-02',
    endDate: '2026-07-02',
  },
  { intolerances: ['Laktose'], startDate: '2026-07-01', endDate: '2026-07-02' },
]

const renderOverview = (
  list = participants,
  people = intolerances,
  dummy = false
) =>
  render(
    <AlertProvider>
      <FoodOverview
        participants={list}
        intolerances={people}
        intolerancesAreDummyData={dummy}
      />
    </AlertProvider>
  )

describe('FoodOverview', () => {
  beforeEach(() => mockedDownload.mockClear())

  it('shows one row per day and meal with the counts', () => {
    renderOverview()

    const rows = within(screen.getAllByRole('table')[0]).getAllByRole('row')
    expect(rows.map((row) => row.textContent)).toEqual([
      'MahlzeitAllesVegetarischGesamt',
      'Mi., 01.07.',
      'Frühstück101',
      'Mittagessen101',
      'Abendessen101',
      'Do., 02.07.',
      'Frühstück112',
      'Mittagessen112',
      'Abendessen112',
    ])
  })

  it('does not render a chart anymore', () => {
    const { container } = renderOverview()
    expect(container.querySelector('.recharts-wrapper')).toBeNull()
  })

  it('downloads the overview as excel file', async () => {
    renderOverview()

    fireEvent.click(screen.getByRole('button', { name: /Excel herunterladen/ }))

    await waitFor(() => expect(mockedDownload).toHaveBeenCalledTimes(1))
    expect(mockedDownload.mock.calls[0][0]).toHaveLength(2)
    expect(mockedDownload.mock.calls[0][1]).toHaveLength(2)
  })

  it('shows an alert when the download fails', async () => {
    mockedDownload.mockRejectedValueOnce(new Error('kein Speicherplatz'))
    renderOverview()

    fireEvent.click(screen.getByRole('button', { name: /Excel herunterladen/ }))

    expect(
      await screen.findByText(
        'Excel-Download fehlgeschlagen: kein Speicherplatz'
      )
    ).toBeInTheDocument()
  })

  it('lists the intolerance counts per day', () => {
    renderOverview()

    const days = screen.getAllByRole('list')[0].querySelectorAll(':scope > li')
    expect([...days].map((day) => day.textContent)).toEqual([
      'Mi., 01.07.Laktose1',
      'Do., 02.07.Laktose2Gluten1',
    ])
  })

  it('marks dummy intolerances as sample data', () => {
    renderOverview(participants, intolerances, true)
    expect(screen.getByText('Beispieldaten')).toBeInTheDocument()
  })

  it('shows a hint when nobody has an intolerance', () => {
    renderOverview(participants, [])
    expect(
      screen.getByText('Keine Unverträglichkeiten angegeben.')
    ).toBeInTheDocument()
    expect(screen.queryByText('Beispieldaten')).not.toBeInTheDocument()
  })

  it('shows a hint and disables the download without any data', () => {
    renderOverview([], [])

    expect(
      screen.getByText('Noch keine Anmeldungen vorhanden.')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Excel herunterladen/ })
    ).toBeDisabled()
  })
})
