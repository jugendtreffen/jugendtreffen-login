import { useQuery } from '@redwoodjs/web'

const PARTICIPANTS_QUERY = gql`
  query DashboardParticipantsQuery {
    participants {
      id
      birthdate
      gender
      accommodation
      startDate
      endDate
      foodChoice
      participationRole
    }
  }
`

// --- Helpers ---
const calcAge = (birthdate: string): number => {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

const AGE_GROUPS = [
  { label: '< 14', min: 0, max: 13 },
  { label: '14–17', min: 14, max: 17 },
  { label: '18–25', min: 18, max: 25 },
  { label: '26–35', min: 26, max: 35 },
  { label: '36+', min: 36, max: 200 },
]
const bucketAge = (age: number) =>
  AGE_GROUPS.find((g) => age >= g.min && age <= g.max)?.label ?? 'Unbekannt'

const PRIESTER_ROLES = ['priester', 'ordensmann', 'vortragende', 'vortragender', 'referent']
const isPriesterRole = (role?: string | null) =>
  !!role && PRIESTER_ROLES.some((r) => role.toLowerCase().includes(r))

const getDayRange = (start: string, end: string): string[] => {
  const days: string[] = []
  const cur = new Date(start)
  const endD = new Date(end)
  while (cur <= endD) {
    days.push(cur.toISOString().slice(0, 10))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

// --- Stat builders ---
type Participant = {
  id: string; birthdate: string; gender: string; accommodation: string
  startDate: string; endDate: string; foodChoice: string; participationRole?: string | null
}

const buildQuartierData = (ps: Participant[]) => {
  const buben: Record<string, number> = {}
  const maedchen: Record<string, number> = {}
  AGE_GROUPS.forEach(({ label }) => { buben[label] = 0; maedchen[label] = 0 })
  ps.forEach((p) => {
    const group = bucketAge(calcAge(p.birthdate))
    const g = p.gender.toLowerCase()
    const isMale = g === 'm' || g === 'male' || g === 'männlich' || g === 'mann'
    if (isMale) buben[group]++; else maedchen[group]++
  })
  return AGE_GROUPS.map(({ label }) => ({ ageGroup: label, "Burschen": buben[label], "Mädchen": maedchen[label] }))
}

const buildFoodData = (ps: Participant[]) => {
  const dayCounts: Record<string, Record<string, number>> = {}
  ps.forEach((p) => {
    getDayRange(p.startDate, p.endDate).forEach((day) => {
      if (!dayCounts[day]) dayCounts[day] = {}
      const food = p.foodChoice || 'Unbekannt'
      dayCounts[day][food] = (dayCounts[day][food] ?? 0) + 1
    })
  })
  const sortedDays = Object.keys(dayCounts).sort()
  const allFoods = [...new Set(ps.map((p) => p.foodChoice || 'Unbekannt'))]
  return {
    data: sortedDays.map((day) => ({
      day: new Date(day).toLocaleDateString('de-AT', { weekday: 'short', day: '2-digit', month: '2-digit' }),
      ...Object.fromEntries(allFoods.map((f) => [f, dayCounts[day][f] ?? 0])),
    })),
    foodTypes: allFoods,
  }
}

const buildPriesterData = (ps: Participant[]) => {
  const counts: Record<string, number> = {}
  ps.filter((p) => isPriesterRole(p.participationRole))
    .forEach((p) => { const acc = p.accommodation || 'Unbekannt'; counts[acc] = (counts[acc] ?? 0) + 1 })
  return Object.entries(counts)
    .map(([accommodation, count]) => ({ accommodation, count }))
    .sort((a, b) => b.count - a.count)
}

const COLORS = ['#ea580c','#3b82f6','#22c55e','#a855f7','#eab308','#06b6d4','#f43f5e','#14b8a6']

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
    <h2 className="mb-4 text-base font-semibold text-card-foreground">{title}</h2>
    {children}
  </div>
)

const KPICard = ({ label, value, sub }: { label: string; value: number | string; sub?: string }) => (
  <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">{value}</p>
    {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
  </div>
)

// --- Main Component ---
const DashboardView = () => {
  const { data, loading, error } = useQuery(PARTICIPANTS_QUERY)

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Daten werden geladen …</div>
  if (error) return <div className="rounded-xl border border-destructive bg-destructive/10 p-6 text-destructive">Fehler: {error.message}</div>

  const participants: Participant[] = data?.participants ?? []
  const total = participants.length
  const burschen = participants.filter((p) => { const g = p.gender.toLowerCase(); return g === 'm' || g === 'male' || g === 'männlich' || g === 'mann' }).length
  const priestCount = participants.filter((p) => isPriesterRole(p.participationRole)).length

  const quartierData = buildQuartierData(participants)
  const { data: foodData, foodTypes } = buildFoodData(participants)
  const priesterData = buildPriesterData(participants)

  const tooltipStyle = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '13px' }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Statistik-Übersicht aller angemeldeten Teilnehmenden</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Gesamt" value={total} />
        <KPICard label="Burschen" value={burschen} />
        <KPICard label="Mädchen" value={total - burschen} />
        <KPICard label="Priester / Ordens / Vortr." value={priestCount} sub={`${((priestCount / (total || 1)) * 100).toFixed(1)} %`} />
      </div>


    </div>
  )
}

export default DashboardView
