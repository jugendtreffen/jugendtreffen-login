import writeExcelFile from 'write-excel-file/browser'

export type FoodParticipant = {
  startDate: string
  endDate: string
  foodChoice: string
}

/** Anzahl pro Essenswahl (z.B. any, vegetarian) plus Gesamtzahl */
export type FoodCounts = Record<string, number> & { total: number }

export type IntoleranceParticipant = {
  name: string
  familyName: string
  intolerances: string[]
  startDate: string
  endDate: string
}

export type FoodDay = {
  date: string // YYYY-MM-DD
  label: string // z.B. "Mi., 01.07."
  meals: Record<string, FoodCounts>
}

// Essenswahl aus dem Anmeldeformular. Reihenfolge = Reihenfolge in Tabelle und Excel.
// Andere Werte zählen nur in "Gesamt".
export const FOOD_CHOICES = [
  { key: 'any', label: 'Alles' },
  { key: 'vegetarian', label: 'Vegetarisch' },
]

export const MEALS = [
  { key: 'breakfast', label: 'Frühstück' },
  { key: 'lunch', label: 'Mittagessen' },
  { key: 'dinner', label: 'Abendessen' },
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

/** Zeitraum als "01.07. – 05.07." */
export const formatPeriod = (start: string, end: string) => {
  const format = (date: string) =>
    new Intl.DateTimeFormat('de-AT', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    }).format(new Date(date))
  return `${format(start)} – ${format(end)}`
}

/** Teilnehmer mit Unverträglichkeiten, sortiert nach Nachname */
export const sortIntolerances = (participants: IntoleranceParticipant[]) =>
  participants
    .filter(({ intolerances }) => intolerances.length > 0)
    .sort((a, b) =>
      `${a.familyName} ${a.name}`.localeCompare(`${b.familyName} ${b.name}`)
    )

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

const emptyCounts = (): FoodCounts => {
  const counts = { total: 0 } as FoodCounts
  FOOD_CHOICES.forEach(({ key }) => (counts[key] = 0))
  return counts
}

const emptyDay = (date: string): FoodDay => ({
  date,
  label: formatDayLabel(date),
  meals: Object.fromEntries(MEALS.map(({ key }) => [key, emptyCounts()])),
})

/**
 * Zählt pro Tag und Mahlzeit, wie viele Teilnehmer welche Essenswahl haben.
 * In der Datenbank gibt es noch keine Angabe pro Mahlzeit: Wer an einem Tag da ist,
 * zählt für Frühstück, Mittag- und Abendessen.
 */
export const buildFoodOverview = (
  participants: FoodParticipant[]
): FoodDay[] => {
  const days: Record<string, FoodDay> = {}

  for (const participant of participants) {
    for (const date of getDays(participant.startDate, participant.endDate)) {
      const day = (days[date] ??= emptyDay(date))

      for (const { key: meal } of MEALS) {
        const counts = day.meals[meal]
        counts.total += 1
        if (isKnownFoodChoice(participant.foodChoice)) {
          counts[participant.foodChoice] += 1
        }
      }
    }
  }

  return Object.values(days).sort((a, b) => a.date.localeCompare(b.date))
}

const bold = (values: string[]) =>
  values.map((value) => ({ value, fontWeight: 'bold' as const }))

/**
 * Lädt die Übersicht als Excel-Datei herunter:
 * Blatt 1 eine Zeile pro Tag und Mahlzeit, Blatt 2 die Unverträglichkeiten
 */
export const downloadFoodOverviewExcel = (
  foodDays: FoodDay[],
  intolerances: IntoleranceParticipant[]
) => {
  const mealRows = foodDays.flatMap((day) =>
    MEALS.map(({ key, label }) => [
      day.label,
      label,
      ...FOOD_CHOICES.map((choice) => day.meals[key][choice.key]),
      day.meals[key].total,
    ])
  )
  const intoleranceRows = sortIntolerances(intolerances).map((person) => [
    `${person.name} ${person.familyName}`,
    person.intolerances.join(', '),
    formatPeriod(person.startDate, person.endDate),
  ])

  return writeExcelFile([
    {
      sheet: 'Essensübersicht',
      data: [
        bold([
          'Tag',
          'Mahlzeit',
          ...FOOD_CHOICES.map(({ label }) => label),
          'Gesamt',
        ]),
        ...mealRows,
      ],
    },
    {
      sheet: 'Unverträglichkeiten',
      data: [
        bold(['Name', 'Unverträglichkeiten', 'Zeitraum']),
        ...intoleranceRows,
      ],
    },
  ]).toFile(`Essensuebersicht_${toDateKey(new Date())}.xlsx`)
}
