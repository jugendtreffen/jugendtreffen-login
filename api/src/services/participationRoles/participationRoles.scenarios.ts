import type { Prisma, ParticipationRole } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ParticipationRoleCreateArgs>({
  participationRole: {
    one: { data: { desc: 'String8165364' } },
    two: { data: { desc: 'String1464449' } },
  },
})

export type StandardScenario = ScenarioData<
  ParticipationRole,
  'participationRole'
>
