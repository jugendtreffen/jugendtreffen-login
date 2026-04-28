import {type ClassValue, clsx} from 'clsx'
import {useState} from 'react'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDuration(start: Date, end: Date) {
  const diffTime = Math.abs(end.getDate() - start.getDate())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function formatDate(dateString: Date) {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export function formatDayMonth(dateString: string) {
  try {
    return new Intl.DateTimeFormat('de-AT', {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(dateString))
  } catch (error) {
    return ''
  }
}

export function formatYear(dateString: string) {
  try {
    return new Intl.DateTimeFormat('de-AT', {
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(dateString))
  } catch (error) {
    return ''
  }
}

export function formatGender(gender: string) {
  switch (gender) {
    case 'male': return 'Männlich'
    case 'female': return 'Weiblich'
    default: return '-'
  }
}

export function formatCountry(countryCode: string) {
  switch (countryCode) {
    case 'AT': return 'Österreich'
    case 'DE': return 'Deutschland'
    case 'CH': return 'Schweiz'
    case 'IT': return 'Italien'
    case 'FR': return 'Frankreich'
    case 'HU': return 'Ungarn'
    case 'LU': return 'Luxemburg'
    case '--': return 'Sonstiges'
    default: return '-'
  }
}

export function formatTravelMethod(travelMethod: string) {
  switch (travelMethod) {
    case 'car': return 'Auto'
    case 'train': return 'Zug'
    case 'bus': return 'Bus'
    default: return '-'
  }
}

export function formatAccomodation(accommodation: string) {
  switch (accommodation) {
    case 'jugendtreffen': return 'Beim Jugendtreffen'
    case 'private': return 'unabhängig vom Jugendtreffen'
    case 'subiaco': return 'Haus Subiaco'
    case 'family': return 'Privatunterkunft (organisiert vom Jugendtreffen)'
    default: return '-'
  }
}

export function formatFoodChoice(foodChoice: string) {
    switch (foodChoice) {
      case 'any': return 'Nicht Wählerisch'
      case 'vegetarian': return 'Vegetarisch'
      case 'gluten-free': return 'Glutenfrei'
      default: return '-'
    }
}

export function formatParticipationRole(participationRole: string) {
  switch (participationRole) {
    case 'teilnehmer': return 'Teilnehmer'
    case 'priester': return '(Ordens-)Priester'
    case 'ordensmann/ordensfrau': return 'Ordensmann/Ordensfrau'
    case 'begleitperson': return 'Begleitperson'
    case 'vortragender': return 'Vortragender'
  }
}

export function isMobile() {
  return window?.innerWidth < 768
}

export function useForceUpdate() {
  const [, setTick] = useState(0)
  return () => setTick((t) => t + 1)
}
