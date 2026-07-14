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
import type { FoodChartData } from './dashboard.types'

const FOOD_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#14b8a6',
  '#ec4899',
  '#3b82f6',
]

function buildFoodChartConfig(foodChoices: string[]): ChartConfig {
  return Object.fromEntries(
    foodChoices.map((foodChoice, index) => [
      foodChoice,
      {
        label: foodChoice,
        color: FOOD_COLORS[index % FOOD_COLORS.length],
      },
    ])
  )
}

type FoodChoiceByDayChartProps = {
  foodStats: FoodChartData
}

const FoodChoiceByDayChart = ({
                                foodStats,
                              }: FoodChoiceByDayChartProps) => {
  if (foodStats.data.length === 0) {
    return (
      <DashboardSectionCard
        title="Food Choice nach Tagen"
        description="Gestapelte Tagesübersicht basierend auf Aufenthaltszeitraum je Teilnehmer:in."
      >
        <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Keine Verpflegungsdaten vorhanden.
          </p>
        </div>
      </DashboardSectionCard>
    )
  }

  const chartConfig = buildFoodChartConfig(foodStats.foodChoices)

  return (
    <DashboardSectionCard
      title="Food Choice nach Tagen"
      description="Gestapelte Tagesübersicht basierend auf Aufenthaltszeitraum je Teilnehmer:in."
    >
      <ChartContainer config={chartConfig} className="h-90 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={foodStats.data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
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
            {foodStats.foodChoices.map((foodChoice) => (
              <Bar
                key={foodChoice}
                dataKey={foodChoice}
                stackId="food"
                fill={`var(--color-${foodChoice})`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardSectionCard>
  )
}

export default FoodChoiceByDayChart
