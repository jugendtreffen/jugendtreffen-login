import type { AccomodationCheckIn, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AccomodationCheckInCreateArgs>({
  accomodationCheckIn: {
    one: {
      data: {
        date: '2026-06-23T20:03:18.300Z',
        participantId: 'String',
        event: {
          create: {
            name: 'String3091143',
            startDate: '2026-06-23T20:03:18.320Z',
            endDate: '2026-06-23T20:03:18.320Z',
          },
        },
      },
    },
    two: {
      data: {
        date: '2026-06-23T20:03:18.320Z',
        participantId: 'String',
        event: {
          create: {
            name: 'String3526890',
            startDate: '2026-06-23T20:03:18.335Z',
            endDate: '2026-06-23T20:03:18.335Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  AccomodationCheckIn,
  'accomodationCheckIn'
>
