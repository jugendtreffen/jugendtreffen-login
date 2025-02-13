import type { Prisma, Participation } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ParticipationCreateArgs>({
  participation: {
    one: {
      data: {
        startDate: '2025-02-11T14:28:17.049Z',
        endDate: '2025-02-11T14:28:17.049Z',
        foodChoice: 'String',
        acceptPhotos: true,
        acceptCoC: true,
      },
    },
    two: {
      data: {
        startDate: '2025-02-11T14:28:17.049Z',
        endDate: '2025-02-11T14:28:17.049Z',
        foodChoice: 'String',
        acceptPhotos: true,
        acceptCoC: true,
      },
    },
  },
})

export type StandardScenario = ScenarioData<Participation, 'participation'>
