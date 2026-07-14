export type ParticipantDashboardItem = {
  id: string
  birthdate: string
  gender: string
  accommodation: string
  startDate: string
  endDate: string
  foodChoice: string
  participationRole?: string | null
  event?: {
    id: string | number
    startDate: string
  } | null
}

export type QuartierAgeRow = {
  ageGroup: string
  boys: number
  girls: number
}

export type RoleAccommodationRow = {
  accommodation: string
  people: number
}

export type FoodChoiceDayRow = {
  day: string
  label: string
  [foodChoice: string]: string | number
}

export type FoodChartData = {
  data: FoodChoiceDayRow[]
  foodChoices: string[]
}
