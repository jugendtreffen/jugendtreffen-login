import type { Prisma, Participation } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ParticipationCreateArgs>({
  participation: {
    one: {
      data: {
        year: 6118464,
        arrival: '2024-12-23T09:45:02.120Z',
        departure: '2024-12-23T09:45:02.120Z',
        acceptPhotos: true,
        acceptCoC: true,
      },
    },
    two: {
      data: {
        year: 9147956,
        arrival: '2024-12-23T09:45:02.120Z',
        departure: '2024-12-23T09:45:02.120Z',
        acceptPhotos: true,
        acceptCoC: true,
      },
    },
  },
})

export type StandardScenario = ScenarioData<Participation, 'participation'>
