import type { Presence, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PresenceCreateArgs>({
  presence: {
    one: {
      data: {
        date: '2025-09-21T15:24:55.489Z',
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000001',
        event: {
          create: {
            name: 'String715314-1',
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
        userId: '00000000-0000-4000-8000-000000000002',
        event: {
          create: {
            name: 'String5162873-2',
            startDate: '2025-09-21T15:24:55.504Z',
            endDate: '2025-09-21T15:24:55.504Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Presence, 'presence'>
