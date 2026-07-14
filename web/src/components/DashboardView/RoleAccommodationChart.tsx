import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from 'src/components/ui/chart'

import DashboardSectionCard from './DashboardSectionCard'
import type { RoleAccommodationRow } from './dashboard.types'

const BAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#14b8a6',
  '#ec4899',
  '#3b82f6',
]

const chartConfig = {
  people: {
    label: 'Personen',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

type RoleAccommodationChartProps = {
  data: RoleAccommodationRow[]
}

const RoleAccommodationChart = ({ data }: RoleAccommodationChartProps) => {
  return (
    <DashboardSectionCard
      title="Unterkunft für besondere Rollen"
      description="Verteilung für Priester, Ordensmann und Vortragende."
    >
      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Keine Teilnehmenden mit diesen Rollen gefunden.
          </p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="accommodation"
                tickLine={false}
                axisLine={false}
                width={140}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12 }}
              />
              <Bar
                dataKey="people"
                name="Personen"
                fill="var(--color-people)"
                radius={[0, 6, 6, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.accommodation}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </DashboardSectionCard>
  )
}

export default RoleAccommodationChart
