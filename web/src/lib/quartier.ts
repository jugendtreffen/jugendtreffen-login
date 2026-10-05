import { format } from 'date-fns'

export const QUARTIER_STATUS_LABELS: Record<string, string> = {
  present: 'Anwesend',
  absent: 'Abwesend',
  excused: 'Entschuldigt',
  sick: 'Krank',
}

export const toDateString = (d: Date) => format(d, 'yyyy-MM-dd')

// Regel wie im Backend: aktueller Tag bis 2h nach Mitternacht (Admin immer)
export const isEditableDay = (date: string, isAdmin: boolean, now = new Date()) => {
  if (isAdmin) return true
  const shifted = new Date(now.getTime() - 2 * 3600_000)
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Vienna',
  }).format(shifted)
  return date === today
}
