import type { Presence, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PresenceCreateArgs>({
  presence: {
    one: {
      data: {
        date: new Date('2026-07-01'),
        status: 'present',
        userId: '7d1e0f3a-1c2b-4a5d-9e8f-0a1b2c3d4e5f',
        event: {
          create: {
            name: 'Jugendtreffen 2026',
            startDate: new Date('2026-07-01'),
            endDate: new Date('2026-07-05'),
          },
        },
      },
    },
    two: {
      data: {
        date: new Date('2026-07-02'),
        status: 'absent',
        userId: '8e2f1a4b-2d3c-4b6e-8f9a-1b2c3d4e5f60',
        event: {
          create: {
            name: 'Jugendtreffen 2027',
            startDate: new Date('2027-07-01'),
            endDate: new Date('2027-07-05'),
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Presence, 'presence'>
