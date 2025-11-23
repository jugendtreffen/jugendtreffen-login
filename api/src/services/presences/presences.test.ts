import type { Presence } from '@prisma/client'

import {
  createPresence,
  deletePresence,
  presence,
  presences,
  updatePresence,
} from './presences'
import type { StandardScenario } from './presences.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('presences', () => {
  scenario('returns all presences', async (scenario: StandardScenario) => {
    const result = await presences()

    expect(result.length).toEqual(Object.keys(scenario.presence).length)
  })

  scenario('returns a single presence', async (scenario: StandardScenario) => {
    const result = await presence({ id: scenario.presence.one.id })

    expect(result).toEqual(scenario.presence.one)
  })

  scenario('creates a presence', async (scenario: StandardScenario) => {
    const result = await createPresence({
      input: {
        date: '2025-09-21T15:24:55.401Z',
        status: 'String',
        userId: 'String',
        eventId: scenario.presence.two.eventId,
      },
    })

    expect(result.date).toEqual(new Date('2025-09-21T15:24:55.401Z'))
    expect(result.status).toEqual('String')
    expect(result.userId).toEqual('String')
    expect(result.eventId).toEqual(scenario.presence.two.eventId)
  })

  scenario('updates a presence', async (scenario: StandardScenario) => {
    const original = (await presence({
      id: scenario.presence.one.id,
    })) as Presence
    const result = await updatePresence({
      id: original.id,
      input: { date: '2025-09-22T15:24:55.418Z' },
    })

    expect(result.date).toEqual(new Date('2025-09-22T15:24:55.418Z'))
  })

  scenario('deletes a presence', async (scenario: StandardScenario) => {
    const original = (await deletePresence({
      id: scenario.presence.one.id,
    })) as Presence
    const result = await presence({ id: original.id })

    expect(result).toEqual(null)
  })
})
