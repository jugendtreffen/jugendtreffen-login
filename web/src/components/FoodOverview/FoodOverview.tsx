import { Fragment, useState } from 'react'

import { Download } from 'lucide-react'

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
  MEALS,
} from './foodOverview'

// Die shadcn-Tabelle setzt ihre Klassen mit "dark:"-Prefix, daher auch hier "dark:"
const numberColumn = 'dark:text-right tabular-nums'
// Mobil etwas kleinere Schrift, damit alle Spalten ohne Scrollen Platz haben
const tableText = 'dark:text-xs sm:dark:text-sm'

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
      {/* Mobil untereinander, ab sm nebeneinander, damit der Button nicht aus der Karte ragt */}
      <CardHeader className="gap-4 space-y-0 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="space-y-1.5">
          <CardTitle>Essensübersicht</CardTitle>
          <CardDescription>
            Anzahl der Essen pro Tag und Mahlzeit, basierend auf dem
            Aufenthaltszeitraum der Teilnehmer
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 self-start"
          onClick={onDownload}
          disabled={downloading || foodDays.length === 0}
        >
          <Download className="h-4 w-4" />
          Excel herunterladen
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
        <AlertCenter />
        {foodDays.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Noch keine Anmeldungen vorhanden.
          </p>
        ) : (
          <Table className={tableText}>
            <TableHeader>
              <TableRow>
                <TableHead>Mahlzeit</TableHead>
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
                <Fragment key={day.date}>
                  {/* Der Tag als Zwischenüberschrift spart mobil eine Spalte */}
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableCell
                      colSpan={FOOD_CHOICES.length + 2}
                      className="font-medium"
                    >
                      {day.label}
                    </TableCell>
                  </TableRow>
                  {MEALS.map((meal) => (
                    <TableRow key={meal.key}>
                      <TableCell>{meal.label}</TableCell>
                      {FOOD_CHOICES.map((choice) => (
                        <TableCell key={choice.key} className={numberColumn}>
                          {day.meals[meal.key][choice.key]}
                        </TableCell>
                      ))}
                      <TableCell className={`${numberColumn} font-medium`}>
                        {day.meals[meal.key].total}
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default FoodOverview
