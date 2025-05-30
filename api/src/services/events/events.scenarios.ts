import type { Prisma, Event } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EventCreateArgs>({
  event: {
    one: { data: { name: 'String1544156' } },
    two: { data: { name: 'String9992871' } },
  },
})

export type StandardScenario = ScenarioData<Event, 'event'>
