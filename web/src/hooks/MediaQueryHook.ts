import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const getMatches = (): boolean => {
    // SSR-safe: window existiert auf dem Server nicht
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(getMatches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)

    // Safari < 14 unterstützt addEventListener nicht
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange) // Fallback
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [query]) // neu subscriben wenn query sich ändert

  return matches
}
