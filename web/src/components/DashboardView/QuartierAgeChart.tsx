import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from 'src/components/ui/chart'

import DashboardSectionCard from './DashboardSectionCard'
import type { QuartierAgeRow } from './dashboard.types'

const chartConfig = {
  boys: {
    label: 'Burschen',
    color: '#3b82f6',
  },
  girls: {
    label: 'Mädchen',
    color: '#ec4899',
  },
} satisfies ChartConfig

type QuartierAgeChartProps = {
  data: QuartierAgeRow[]
}

const QuartierAgeChart = ({ data }: QuartierAgeChartProps) => {
  return (
    <DashboardSectionCard
      title="Quartier nach Alter"
      description="Burschen und Mädchen getrennt nach Altersgruppen."
    >
      <ChartContainer config={chartConfig} className="h-80w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="ageGroup"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="boys"
              name="Burschen"
              fill="var(--color-boys)"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="girls"
              name="Mädchen"
              fill="var(--color-girls)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardSectionCard>
  )
}

export default QuartierAgeChart
