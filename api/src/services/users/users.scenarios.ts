import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String2839337',
        name: 'String',
        familyName: 'String',
        role: { create: { desc: 'String3168460' } },
      },
    },
    two: {
      data: {
        email: 'String9532543',
        name: 'String',
        familyName: 'String',
        role: { create: { desc: 'String5121216' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
