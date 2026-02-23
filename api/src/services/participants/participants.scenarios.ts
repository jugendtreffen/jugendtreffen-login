import type { Participant, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ParticipantCreateArgs>({
  participant: {
    one: {
      data: {
        name: 'String',
        familyName: 'String',
        birthdate: '2026-02-23T21:05:28.580Z',
        gender: 'String',
        phoneNumber: 'String',
        country: 'String',
        city: 'String',
        postalCode: 'String',
        address: 'String',
        accommodation: 'String',
        startDate: '2026-02-23T21:05:28.580Z',
        endDate: '2026-02-23T21:05:28.580Z',
        foodChoice: 'String',
        acceptPhotos: true,
        acceptCoC: true,
        event: {
          create: {
            name: 'String4737526',
            startDate: '2026-02-23T21:05:28.589Z',
            endDate: '2026-02-23T21:05:28.589Z',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        familyName: 'String',
        birthdate: '2026-02-23T21:05:28.589Z',
        gender: 'String',
        phoneNumber: 'String',
        country: 'String',
        city: 'String',
        postalCode: 'String',
        address: 'String',
        accommodation: 'String',
        startDate: '2026-02-23T21:05:28.589Z',
        endDate: '2026-02-23T21:05:28.589Z',
        foodChoice: 'String',
        acceptPhotos: true,
        acceptCoC: true,
        event: {
          create: {
            name: 'String8739202',
            startDate: '2026-02-23T21:05:28.597Z',
            endDate: '2026-02-23T21:05:28.597Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Participant, 'participant'>
