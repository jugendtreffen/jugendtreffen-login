import type { Prisma, PersonalData } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PersonalDataCreateArgs>({
  personalData: {
    one: {
      data: {
        name: 'String',
        familyName: 'String',
        role: { create: { desc: 'String7424107' } },
      },
    },
    two: {
      data: {
        name: 'String',
        familyName: 'String',
        role: { create: { desc: 'String3594471' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<PersonalData, 'personalData'>
