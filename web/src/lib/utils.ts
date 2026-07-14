import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDuration(start: Date, end: Date) {
  const diffTime = Math.abs(end.getDate() - start.getDate())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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
