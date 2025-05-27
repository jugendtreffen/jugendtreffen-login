import type { Prisma, ParticipationRole } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ParticipationRoleCreateArgs>({
  participationRole: {
    one: { data: { desc: 'String3289946' } },
    two: { data: { desc: 'String8938368' } },
  },
})

export type StandardScenario = ScenarioData<
  ParticipationRole,
  'participationRole'
>
