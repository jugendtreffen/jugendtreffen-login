import type { IntoleranceParticipant } from './foodOverview'

// TODO: Beispieldaten – ersetzen, sobald Datenbank und API Unverträglichkeiten liefern
// (z.B. ein Feld "intolerances" in der DashboardParticipantsQuery)
export const DUMMY_INTOLERANCES: IntoleranceParticipant[] = [
  {
    intolerances: ['Laktose'],
    startDate: '2026-07-01',
    endDate: '2026-07-05',
  },
  {
    intolerances: ['Gluten', 'Nüsse'],
    startDate: '2026-07-02',
    endDate: '2026-07-05',
  },
  {
    intolerances: ['Fruktose'],
    startDate: '2026-07-01',
    endDate: '2026-07-03',
  },
  {
    intolerances: ['Laktose', 'Ei'],
    startDate: '2026-07-03',
    endDate: '2026-07-05',
  },
]
