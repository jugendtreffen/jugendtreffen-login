import React, { useEffect, useState } from 'react'
import { ArrowLeft, QrCode } from 'lucide-react'

import { Metadata } from '@redwoodjs/web'

import { useAuth } from '@/auth'
import QuartierOverviewCell from '@/components/QuartierOverviewCell/QuartierOverviewCell'
import { Button } from '@/components/ui/button'
import { Datepicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSidebar } from '@/layouts/SidebarLayout/SidebarLayout'
import { isEditableDay, toDateString } from '@/lib/quartier'

const QuartierOverviewView = () => {
  const { currentUser } = useAuth()
  const { subState, setSubState } = useSidebar()
  const role = currentUser?.roles?.at(0) as string | undefined
  const isAdmin = role === 'admin'

  const [date, setDate] = useState<Date>(new Date())
  const [adminGender, setAdminGender] = useState<'male' | 'female'>('male')

  useEffect(() => {
    setSubState('Overview')
  }, [setSubState])

  const gender = isAdmin
    ? adminGender
    : role === 'quartier_girls'
      ? 'female'
      : 'male'
  const dateString = toDateString(date)
  const editable = isEditableDay(dateString, isAdmin)

  // Platzhalter bis zum Ticket "QR-Quartier Anmeldung"
  if (subState === 'QR') {
    return (
      <section className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setSubState('Overview')}
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Button>
        <h1 className="text-xl font-bold">QR-Quartieranmeldung</h1>
        <p className="text-sm text-muted-foreground">
          Der QR-Scanner folgt in einem eigenen Ticket.
        </p>
      </section>
    )
  }

  return (
    <>
      <Metadata title="Quartier Overview" />
      <section className="flex flex-col gap-2 space-y-6">
        <div>
          <h1 className="text-xl font-bold">
            Quartier {gender === 'male' ? 'Burschen' : 'Mädchen'} – Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Status der Teilnehmer für den gewählten Tag.
            {!editable && ' Dieser Tag ist nur lesbar.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48">
            <Datepicker
              name="quartier-date"
              formControl={undefined}
              value={date}
              onChange={(d: Date) => d && setDate(d)}
            />
          </div>
          {isAdmin && (
            <Select
              value={adminGender}
              onValueChange={(v) => setAdminGender(v as 'male' | 'female')}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Burschen</SelectItem>
                <SelectItem value="female">Mädchen</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button onClick={() => setSubState('QR')}>
            <QrCode className="h-4 w-4" /> QR
          </Button>
        </div>

        <QuartierOverviewCell
          gender={gender}
          location="jugendtreffen"
          date={dateString}
          editable={editable}
        />
      </section>
    </>
  )
}

export default QuartierOverviewView
