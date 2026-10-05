import type { Event, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

const daysFromNow = (days: number) => {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() + days)
  return date
}

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    past: {
      data: {
        name: 'Jugendtreffen Vorjahr',
        desc: 'Bereits vorbei',
        startDate: daysFromNow(-370),
        endDate: daysFromNow(-365),
      },
    },
    next: {
      data: {
        name: 'Jugendtreffen Nächstes',
        desc: 'Das nächste anstehende Event',
        startDate: daysFromNow(30),
        endDate: daysFromNow(35),
      },
    },
    later: {
      data: {
        name: 'Jugendtreffen Übernächstes',
        desc: null,
        startDate: daysFromNow(400),
        endDate: daysFromNow(405),
      },
    },
  },
})

export const running = defineScenario<Prisma.EventCreateArgs>({
  event: {
    current: {
      data: {
        name: 'Jugendtreffen Läuft',
        startDate: daysFromNow(-2),
        endDate: daysFromNow(0),
      },
    },
  },
})

export const onlyPast = defineScenario<Prisma.EventCreateArgs>({
  event: {
    past: {
      data: {
        name: 'Jugendtreffen Vorbei',
        startDate: daysFromNow(-10),
        endDate: daysFromNow(-5),
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
