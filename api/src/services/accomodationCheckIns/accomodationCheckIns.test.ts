import type { AccomodationCheckIn } from '@prisma/client'

import {
  accomodationCheckIn,
  accomodationCheckIns,
  createAccomodationCheckIn,
  deleteAccomodationCheckIn,
  updateAccomodationCheckIn,
} from './accomodationCheckIns'
import type { StandardScenario } from './accomodationCheckIns.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('accomodationCheckIns', () => {
  scenario(
    'returns all accomodationCheckIns',
    async (scenario: StandardScenario) => {
      const result = await accomodationCheckIns()

      expect(result.length).toEqual(
        Object.keys(scenario.accomodationCheckIn).length
      )
    }
  )

  scenario(
    'returns a single accomodationCheckIn',
    async (scenario: StandardScenario) => {
      const result = await accomodationCheckIn({
        id: scenario.accomodationCheckIn.one.id,
      })

      expect(result).toEqual(scenario.accomodationCheckIn.one)
    }
  )

  scenario(
    'creates a accomodationCheckIn',
    async (scenario: StandardScenario) => {
      const result = await createAccomodationCheckIn({
        input: {
          date: '2026-06-23T20:03:18.007Z',
          participantId: 'String',
          eventId: scenario.accomodationCheckIn.two.eventId,
        },
      })

      expect(result.date).toEqual(new Date('2026-06-23T20:03:18.007Z'))
      expect(result.participantId).toEqual('String')
      expect(result.eventId).toEqual(scenario.accomodationCheckIn.two.eventId)
    }
  )

  scenario(
    'updates a accomodationCheckIn',
    async (scenario: StandardScenario) => {
      const original = (await accomodationCheckIn({
        id: scenario.accomodationCheckIn.one.id,
      })) as AccomodationCheckIn
      const result = await updateAccomodationCheckIn({
        id: original.id,
        input: { date: '2026-06-24T20:03:18.034Z' },
      })

      expect(result.date).toEqual(new Date('2026-06-24T20:03:18.034Z'))
    }
  )

  scenario(
    'deletes a accomodationCheckIn',
    async (scenario: StandardScenario) => {
      const original = (await deleteAccomodationCheckIn({
        id: scenario.accomodationCheckIn.one.id,
      })) as AccomodationCheckIn
      const result = await accomodationCheckIn({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
