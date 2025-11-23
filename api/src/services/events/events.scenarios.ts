import type { Event, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    one: {
      data: {
        name: 'Jugendtreffen 2025',
        desc: 'Annual youth gathering with workshops and activities.',
        startDate: new Date('2025-07-15T09:00:00.000Z'),
        endDate: new Date('2025-07-20T18:00:00.000Z'),
        createdAt: new Date('2025-06-01T12:00:00.000Z'),
      },
    },
    two: {
      data: {
        name: 'Winter Retreat 2025',
        desc: 'A cozy winter event for reflection and fun.',
        startDate: new Date('2025-12-10T10:00:00.000Z'),
        endDate: new Date('2025-12-15T16:00:00.000Z'),
        createdAt: new Date('2025-11-01T12:00:00.000Z'),
      },
    },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
