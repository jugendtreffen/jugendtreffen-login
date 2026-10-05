import { Fragment, useState } from 'react'

import { Download } from 'lucide-react'

import AlertCenter from '@/components/ui/Alert/AlertCenter'
import { Badge } from '@/components/ui/badge'
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
  formatPeriod,
  IntoleranceParticipant,
  MEALS,
  sortIntolerances,
} from './foodOverview'

// Die shadcn-Tabelle setzt ihre Klassen mit "dark:"-Prefix, daher auch hier "dark:"
const numberColumn = 'dark:text-right tabular-nums'
// Mobil etwas kleinere Schrift, damit alle Spalten ohne Scrollen Platz haben
const tableText = 'dark:text-xs sm:dark:text-sm'

type Props = {
  participants: FoodParticipant[]
  intolerances: IntoleranceParticipant[]
  /** Hinweis anzeigen, solange die Unverträglichkeiten Beispieldaten sind */
  intolerancesAreDummyData?: boolean
}

const FoodOverview = ({
  participants,
  intolerances,
  intolerancesAreDummyData = false,
}: Props) => {
  const { addAlert } = useAlert()
  const [downloading, setDownloading] = useState(false)
  const foodDays = buildFoodOverview(participants)
  const intolerancePeople = sortIntolerances(intolerances)

  const onDownload = async () => {
    setDownloading(true)
    try {
      await downloadFoodOverviewExcel(foodDays, intolerances)
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
          disabled={
            downloading ||
            (foodDays.length === 0 && intolerancePeople.length === 0)
          }
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

        <div className="space-y-2 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">Unverträglichkeiten</h3>
            {intolerancesAreDummyData && (
              <Badge variant="outline">Beispieldaten</Badge>
            )}
          </div>
          {intolerancePeople.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Keine Unverträglichkeiten angegeben.
            </p>
          ) : (
            <Table className={tableText}>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unverträglichkeit</TableHead>
                  <TableHead>Zeitraum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intolerancePeople.map((person) => (
                  <TableRow key={`${person.familyName}-${person.name}`}>
                    <TableCell className="font-medium">
                      {person.name} {person.familyName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {person.intolerances.map((intolerance) => (
                          <Badge key={intolerance} variant="secondary">
                            {intolerance}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatPeriod(person.startDate, person.endDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FoodOverview
