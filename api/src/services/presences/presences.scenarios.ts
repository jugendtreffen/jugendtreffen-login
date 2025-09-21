import type { Presence, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PresenceCreateArgs>({
  presence: {
    one: {
      data: {
        date: '2025-09-21T15:24:55.489Z',
        status: 'String',
        userId: 'String',
        event: {
          create: {
            name: 'String715314',
            startDate: '2025-09-21T15:24:55.497Z',
            endDate: '2025-09-21T15:24:55.497Z',
          },
        },
      },
    },
    two: {
      data: {
        date: '2025-09-21T15:24:55.497Z',
        status: 'String',
        userId: 'String',
        event: {
          create: {
            name: 'String5162873',
            startDate: '2025-09-21T15:24:55.504Z',
            endDate: '2025-09-21T15:24:55.504Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Presence, 'presence'>
