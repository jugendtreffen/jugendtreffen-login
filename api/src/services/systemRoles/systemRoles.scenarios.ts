import type { Prisma, SystemRole } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SystemRoleCreateArgs>({
  systemRole: {
    one: { data: { desc: 'String968645' } },
    two: { data: { desc: 'String8260969' } },
  },
})

export type StandardScenario = ScenarioData<SystemRole, 'systemRole'>
