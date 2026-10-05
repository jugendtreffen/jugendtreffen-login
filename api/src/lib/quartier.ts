export const QUARTIER_STATUS = ['present', 'absent', 'excused', 'sick'] as const

// Rollen, deren Status am nächsten Tag automatisch übernommen wird
export const SPECIAL_PARTICIPATION_ROLES = [
  'priester',
  'ordensmann/ordensfrau',
  'begleitperson',
  'vortragender',
]

// Änderungen sind am aktuellen Tag und noch bis zu 2h nach Mitternacht erlaubt
const GRACE_HOURS = 2

const viennaDay = (d: Date) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vienna' }).format(d)

export const toDateString = (d: Date | string) =>
  typeof d === 'string' ? d.slice(0, 10) : d.toISOString().slice(0, 10)

export const isEditableDay = (date: Date | string, now = new Date()) =>
  toDateString(date) === viennaDay(new Date(now.getTime() - GRACE_HOURS * 3600_000))
