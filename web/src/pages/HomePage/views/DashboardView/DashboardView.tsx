import { useMemo } from 'react'

import { useQuery } from '@redwoodjs/web'

import DashboardKpiGrid from '@/components/DashboardView/DashboardKpiGrid'
import FoodChoiceByDayChart from '@/components/DashboardView/FoodChoiceByDayChart'
import QuartierAgeChart from '@/components/DashboardView/QuartierAgeChart'
import RoleAccommodationChart from '@/components/DashboardView/RoleAccommodationChart'
import type { ParticipantDashboardItem } from '@/components/DashboardView/dashboard.types'
import { buildDashboardSummary } from '@/components/DashboardView/dashboard.utils'

export const DASHBOARD_VIEW_QUERY = gql`
  query DashboardViewQuery {
    participants {
      id
      birthdate
      gender
      accommodation
      startDate
      endDate
      foodChoice
      participationRole
      event {
        id
        startDate
      }
    }
  }
`

const DashboardView = () => {
  const { data, loading, error } = useQuery<{
    participants: ParticipantDashboardItem[]
  }>(DASHBOARD_VIEW_QUERY)

  const participants = data?.participants ?? []

  const summary = useMemo(
    () => buildDashboardSummary(participants),
    [participants]
  )

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Dashboard wird geladen …</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-card p-6">
        <h2 className="text-lg font-semibold">Fehler beim Laden</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <section className="space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Quartier-, Verpflegungs- und Rollenstatistik für alle Teilnehmenden.
        </p>
      </header>

      <DashboardKpiGrid
        totalParticipants={summary.totalParticipants}
        boys={summary.boys}
        girls={summary.girls}
        specialRoleCount={summary.specialRoleCount}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <QuartierAgeChart data={summary.quartierData} />
        <RoleAccommodationChart data={summary.roleAccommodationData} />
      </div>

      <FoodChoiceByDayChart foodStats={summary.foodStats} />
    </section>
  )
}

export default DashboardView
