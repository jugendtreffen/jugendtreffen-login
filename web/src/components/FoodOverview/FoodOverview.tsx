import { useState } from 'react'

import { Download } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import AlertCenter from '@/components/ui/Alert/AlertCenter'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAlert } from '@/hooks/AlertHook'
import {
  buildFoodOverview,
  downloadFoodOverviewExcel,
  FOOD_CHOICES,
  FoodParticipant,
} from './foodOverview'

const chartConfig: ChartConfig = Object.fromEntries(
  FOOD_CHOICES.map(({ key, label, color }) => [key, { label, color }])
)

// Legende in derselben Reihenfolge wie die gestapelten Balken
const byFoodChoiceOrder = (item: { dataKey?: unknown }) =>
  FOOD_CHOICES.findIndex(({ key }) => key === item.dataKey)

// Die shadcn-Tabelle setzt ihre Klassen mit "dark:"-Prefix, daher auch hier "dark:"
const numberColumn = 'dark:text-right tabular-nums'

type Props = {
  participants: FoodParticipant[]
}

const FoodOverview = ({ participants }: Props) => {
  const { addAlert } = useAlert()
  const [downloading, setDownloading] = useState(false)
  const foodDays = buildFoodOverview(participants)

  const onDownload = async () => {
    setDownloading(true)
    try {
      await downloadFoodOverviewExcel(foodDays)
    } catch (error) {
      addAlert(`Excel-Download fehlgeschlagen: ${error.message}`, 'error')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Essensübersicht</CardTitle>
          <CardDescription>
            Anzahl der Essen pro Tag, basierend auf dem Aufenthaltszeitraum der
            Teilnehmer
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={downloading || foodDays.length === 0}
        >
          <Download className="h-4 w-4" />
          Excel herunterladen
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <AlertCenter />
        {foodDays.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Noch keine Anmeldungen vorhanden.
          </p>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={foodDays}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend
                  content={<ChartLegendContent />}
                  itemSorter={byFoodChoiceOrder}
                />
                {FOOD_CHOICES.map(({ key }, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="food"
                    fill={`var(--color-${key})`}
                    stroke="var(--card)"
                    strokeWidth={2}
                    // nur das oberste Segment bekommt runde Ecken
                    radius={
                      index === FOOD_CHOICES.length - 1 ? [4, 4, 0, 0] : 0
                    }
                  />
                ))}
              </BarChart>
            </ChartContainer>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  {FOOD_CHOICES.map(({ key, label }) => (
                    <TableHead key={key} className={numberColumn}>
                      {label}
                    </TableHead>
                  ))}
                  <TableHead className={numberColumn}>Gesamt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodDays.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>{day.label}</TableCell>
                    {FOOD_CHOICES.map(({ key }) => (
                      <TableCell key={key} className={numberColumn}>
                        {day[key]}
                      </TableCell>
                    ))}
                    <TableCell className={`${numberColumn} font-medium`}>
                      {day.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default FoodOverview
