import type { PersonalData, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PersonalDataCreateArgs>({
  personalData: {
    one: {
      data: {
        id: 'String',
        name: 'String',
        familyName: 'String',
        userId: 'String9301039',
        role: 'String',
      },
    },
    two: {
      data: {
        id: 'String',
        name: 'String',
        familyName: 'String',
        userId: 'String5639607',
        role: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<PersonalData, 'personalData'>
