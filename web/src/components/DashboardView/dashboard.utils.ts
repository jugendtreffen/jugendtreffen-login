import type {
  FoodChartData,
  ParticipantDashboardItem,
  QuartierAgeRow,
  RoleAccommodationRow,
} from './dashboard.types'

const AGE_GROUPS = [
  { label: '< 14', min: 0, max: 13 },
  { label: '14–17', min: 14, max: 17 },
  { label: '18–25', min: 18, max: 25 },
  { label: '26+', min: 26, max: 200 },
] as const

const ROLE_KEYWORDS = [
  'priester',
  'ordensmann',
  'vortragende',
  'vortragender',
  'referent',
] as const

export function parseDateOnly(dateString: string): Date {
  const raw = dateString.slice(0, 10)
  const [year, month, day] = raw.split('-').map(Number)

  return new Date(Date.UTC(year, month - 1, day))
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(date)
}

export function getDaysInclusive(startDate: string, endDate: string): string[] {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  const days: string[] = []

  const current = new Date(start)

  while (current <= end) {
    days.push(current.toISOString().slice(0, 10))
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return days
}

export function normalizeGender(gender: string): 'boys' | 'girls' {
  const value = gender.trim().toLowerCase()

  if (
    value === 'm' ||
    value === 'male' ||
    value === 'männlich' ||
    value === 'mann'
  ) {
    return 'boys'
  }

  return 'girls'
}

export function isSpecialRole(role?: string | null): boolean {
  if (!role) return false

  const normalizedRole = role.trim().toLowerCase()
  return ROLE_KEYWORDS.some((keyword) => normalizedRole.includes(keyword))
}

export function calculateAgeAtReferenceDate(
  birthdate: string,
  referenceDate: string
): number {
  const birth = parseDateOnly(birthdate)
  const reference = parseDateOnly(referenceDate)

  let age = reference.getUTCFullYear() - birth.getUTCFullYear()
  const monthDifference = reference.getUTCMonth() - birth.getUTCMonth()
  const dayDifference = reference.getUTCDate() - birth.getUTCDate()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && dayDifference < 0)
  ) {
    age -= 1
  }

  return age
}

export function getAgeGroupLabel(age: number): string {
  return (
    AGE_GROUPS.find((group) => age >= group.min && age <= group.max)?.label ??
    'Unbekannt'
  )
}

export function buildQuartierStats(
  participants: ParticipantDashboardItem[]
): QuartierAgeRow[] {
  const rows = AGE_GROUPS.map((group) => ({
    ageGroup: group.label,
    boys: 0,
    girls: 0,
  }))

  const rowsByAgeGroup = new Map(rows.map((row) => [row.ageGroup, row]))

  for (const participant of participants) {
    const referenceDate =
      participant.event?.startDate ?? participant.startDate ?? participant.birthdate

    const age = calculateAgeAtReferenceDate(
      participant.birthdate,
      referenceDate
    )
    const ageGroup = getAgeGroupLabel(age)
    const genderKey = normalizeGender(participant.gender)
    const row = rowsByAgeGroup.get(ageGroup)

    if (!row) continue

    row[genderKey] += 1
  }

  return AGE_GROUPS.map((group) => rowsByAgeGroup.get(group.label)!)
}

export function buildFoodChoiceStats(
  participants: ParticipantDashboardItem[]
): FoodChartData {
  const dayMap = new Map<string, Record<string, number>>()
  const foodChoiceSet = new Set<string>()

  for (const participant of participants) {
    const foodChoice = participant.foodChoice?.trim() || 'Unbekannt'
    foodChoiceSet.add(foodChoice)

    for (const day of getDaysInclusive(participant.startDate, participant.endDate)) {
      if (!dayMap.has(day)) {
        dayMap.set(day, {})
      }

      const dayCounts = dayMap.get(day)!
      dayCounts[foodChoice] = (dayCounts[foodChoice] ?? 0) + 1
    }
  }

  const foodChoices = Array.from(foodChoiceSet).sort((a, b) =>
    a.localeCompare(b, 'de')
  )

  const data = Array.from(dayMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([day, counts]) => ({
      day,
      label: formatShortDate(parseDateOnly(day)),
      ...Object.fromEntries(
        foodChoices.map((foodChoice) => [foodChoice, counts[foodChoice] ?? 0])
      ),
    }))

  return { data, foodChoices }
}

export function buildRoleAccommodationStats(
  participants: ParticipantDashboardItem[]
): RoleAccommodationRow[] {
  const accommodationCounts = new Map<string, number>()

  for (const participant of participants) {
    if (!isSpecialRole(participant.participationRole)) continue

    const accommodation = participant.accommodation?.trim() || 'Unbekannt'
    accommodationCounts.set(
      accommodation,
      (accommodationCounts.get(accommodation) ?? 0) + 1
    )
  }

  return Array.from(accommodationCounts.entries())
    .map(([accommodation, people]) => ({
      accommodation,
      people,
    }))
    .sort((left, right) => right.people - left.people)
}

export function buildDashboardSummary(
  participants: ParticipantDashboardItem[]
) {
  const totalParticipants = participants.length
  const boys = participants.filter(
    (participant) => normalizeGender(participant.gender) === 'boys'
  ).length
  const girls = totalParticipants - boys
  const specialRoleCount = participants.filter((participant) =>
    isSpecialRole(participant.participationRole)
  ).length

  return {
    totalParticipants,
    boys,
    girls,
    specialRoleCount,
    quartierData: buildQuartierStats(participants),
    foodStats: buildFoodChoiceStats(participants),
    roleAccommodationData: buildRoleAccommodationStats(participants),
  }
}
