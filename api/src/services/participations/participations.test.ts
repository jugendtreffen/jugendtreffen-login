import type { Participation } from '@prisma/client'

import {
  participations,
  participation,
  createParticipation,
  updateParticipation,
  deleteParticipation,
} from './participations'
import type { StandardScenario } from './participations.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('participations', () => {
  scenario('returns all participations', async (scenario: StandardScenario) => {
    const result = await participations()

    expect(result.length).toEqual(Object.keys(scenario.participation).length)
  })

  scenario(
    'returns a single participation',
    async (scenario: StandardScenario) => {
      const result = await participation({ id: scenario.participation.one.id })

      expect(result).toEqual(scenario.participation.one)
    }
  )

  scenario('creates a participation', async () => {
    const result = await createParticipation({
      input: {
        startDate: '2025-02-11T14:28:17.024Z',
        endDate: '2025-02-11T14:28:17.024Z',
        foodChoice: 'String',
        acceptPhotos: true,
        acceptCoC: true,
      },
    })

    expect(result.startDate).toEqual(new Date('2025-02-11T14:28:17.024Z'))
    expect(result.endDate).toEqual(new Date('2025-02-11T14:28:17.024Z'))
    expect(result.foodChoice).toEqual('String')
    expect(result.acceptPhotos).toEqual(true)
    expect(result.acceptCoC).toEqual(true)
  })

  scenario('updates a participation', async (scenario: StandardScenario) => {
    const original = (await participation({
      id: scenario.participation.one.id,
    })) as Participation
    const result = await updateParticipation({
      id: original.id,
      input: { startDate: '2025-02-12T14:28:17.024Z' },
    })

    expect(result.startDate).toEqual(new Date('2025-02-12T14:28:17.024Z'))
  })

  scenario('deletes a participation', async (scenario: StandardScenario) => {
    const original = (await deleteParticipation({
      id: scenario.participation.one.id,
    })) as Participation
    const result = await participation({ id: original.id })

    expect(result).toEqual(null)
  })
})
