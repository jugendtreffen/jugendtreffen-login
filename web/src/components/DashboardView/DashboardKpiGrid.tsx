import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from 'src/components/ui/card'

type DashboardKpiGridProps = {
  totalParticipants: number
  boys: number
  girls: number
  specialRoleCount: number
}

type KpiCardProps = {
  title: string
  value: number | string
}

const KpiCard = ({ title, value }: KpiCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

const DashboardKpiGrid = ({
                            totalParticipants,
                            boys,
                            girls,
                            specialRoleCount,
                          }: DashboardKpiGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard title="Teilnehmende gesamt" value={totalParticipants} />
      <KpiCard title="Burschen" value={boys} />
      <KpiCard title="Mädchen" value={girls} />
      <KpiCard
        title="Priester / Ordensmann / Vortragende"
        value={specialRoleCount}
      />
    </div>
  )
}

export default DashboardKpiGrid
