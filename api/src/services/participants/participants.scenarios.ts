import type { Participant, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

const participantData = (name: string, birthdate: string) => ({
  name,
  familyName: 'Muster',
  email: `${name.toLowerCase()}@example.com`,
  birthdate: new Date(birthdate),
  gender: 'female',
  phoneNumber: '+43 660 1234567',
  country: 'AT',
  city: 'Kremsmünster',
  postalCode: '4550',
  address: 'Stiftsplatz 1',
  accommodation: 'jugendtreffen',
  startDate: new Date('2026-07-01'),
  endDate: new Date('2026-07-05'),
  foodChoice: 'any',
  acceptPhotos: true,
  acceptCoC: true,
  participationRole: 'teilnehmer',
})

export const standard = defineScenario<Prisma.ParticipantCreateArgs>({
  participant: {
    one: {
      data: {
        ...participantData('Anna', '2008-03-01'),
        event: {
          create: {
            name: 'Jugendtreffen 2026',
            startDate: new Date('2026-07-01'),
            endDate: new Date('2026-07-05'),
          },
        },
      },
    },
    two: {
      data: {
        ...participantData('Ben', '2010-11-20'),
        event: {
          create: {
            name: 'Jugendtreffen 2027',
            startDate: new Date('2027-07-01'),
            endDate: new Date('2027-07-05'),
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Participant, 'participant'>
