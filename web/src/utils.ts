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
