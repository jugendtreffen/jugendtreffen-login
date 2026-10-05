import writeExcelFile from 'write-excel-file/browser'

export type FoodParticipant = {
  startDate: string
  endDate: string
  foodChoice: string
}

export type FoodDay = {
  date: string // YYYY-MM-DD
  label: string // z.B. "Mi., 01.07."
  total: number
  [foodChoice: string]: string | number
}

// Essenswahl aus dem Anmeldeformular. Reihenfolge = Reihenfolge in Chart, Tabelle und Excel.
// Andere Werte zählen nur in "Gesamt".
export const FOOD_CHOICES = [
  { key: 'any', label: 'Alles', color: 'var(--chart-1)' },
  { key: 'vegetarian', label: 'Vegetarisch', color: 'var(--chart-4)' },
]

const isKnownFoodChoice = (foodChoice: string) =>
  FOOD_CHOICES.some(({ key }) => key === foodChoice)

const toDateKey = (date: Date) => date.toISOString().slice(0, 10)

const formatDayLabel = (dateKey: string) =>
  new Intl.DateTimeFormat('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(dateKey))

/** Alle Tage von start bis end (inklusive) als YYYY-MM-DD */
export const getDays = (start: string, end: string) => {
  const days: string[] = []
  const current = new Date(toDateKey(new Date(start)))
  const last = new Date(toDateKey(new Date(end)))

  while (current <= last) {
    days.push(toDateKey(current))
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return days
}

const emptyDay = (date: string): FoodDay => {
  const day: FoodDay = { date, label: formatDayLabel(date), total: 0 }
  FOOD_CHOICES.forEach(({ key }) => (day[key] = 0))
  return day
}

/** Zählt pro Tag, wie viele Teilnehmer welche Essenswahl haben */
export const buildFoodOverview = (
  participants: FoodParticipant[]
): FoodDay[] => {
  const days: Record<string, FoodDay> = {}

  for (const participant of participants) {
    for (const date of getDays(participant.startDate, participant.endDate)) {
      const day = (days[date] ??= emptyDay(date))
      day.total += 1
      if (isKnownFoodChoice(participant.foodChoice)) {
        day[participant.foodChoice] =
          (day[participant.foodChoice] as number) + 1
      }
    }
  }

  return Object.values(days).sort((a, b) => a.date.localeCompare(b.date))
}

/** Lädt die Übersicht als Excel-Datei herunter */
export const downloadFoodOverviewExcel = (foodDays: FoodDay[]) => {
  const header = ['Tag', ...FOOD_CHOICES.map(({ label }) => label), 'Gesamt']
  const rows = foodDays.map((day) => [
    day.label,
    ...FOOD_CHOICES.map(({ key }) => day[key] as number),
    day.total,
  ])

  return writeExcelFile([
    header.map((value) => ({ value, fontWeight: 'bold' as const })),
    ...rows,
  ]).toFile(`Essensuebersicht_${toDateKey(new Date())}.xlsx`)
}
