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

const renderOverview = (list = participants) =>
  render(
    <AlertProvider>
      <FoodOverview participants={list} />
    </AlertProvider>
  )

describe('FoodOverview', () => {
  beforeEach(() => mockedDownload.mockClear())

  it('shows a table row with the counts per day', () => {
    renderOverview()

    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows.map((row) => row.textContent)).toEqual([
      'TagAllesVegetarischGesamt',
      'Mi., 01.07.101',
      'Do., 02.07.112',
    ])
  })

  it('downloads the overview as excel file', async () => {
    renderOverview()

    fireEvent.click(screen.getByRole('button', { name: /Excel herunterladen/ }))

    await waitFor(() => expect(mockedDownload).toHaveBeenCalledTimes(1))
    expect(mockedDownload.mock.calls[0][0]).toHaveLength(2)
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

  it('shows a hint and disables the download without registrations', () => {
    renderOverview([])

    expect(
      screen.getByText('Noch keine Anmeldungen vorhanden.')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Excel herunterladen/ })
    ).toBeDisabled()
  })
})
