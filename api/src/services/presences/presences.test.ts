import type { Presence } from '@prisma/client'

import {
  createPresence,
  deletePresence,
  presence,
  presences,
  updatePresence,
} from './presences'
import type { StandardScenario } from './presences.scenarios'

// Redwood typisiert den BigInt-Scalar in den Resolver-Typen als number
const asId = (id: bigint) => id as unknown as number

describe('presences', () => {
  beforeEach(() => {
    mockCurrentUser({ id: 'admin-1', email: 'admin@example.com', roles: ['admin'] })
  })

  scenario('returns all presences', async (scenario: StandardScenario) => {
    const result = await presences()

    expect(result.length).toEqual(Object.keys(scenario.presence).length)
  })

  scenario('returns a single presence', async (scenario: StandardScenario) => {
    const result = await presence({ id: asId(scenario.presence.one.id) })

    expect(result).toEqual(scenario.presence.one)
  })

  scenario('creates a presence', async (scenario: StandardScenario) => {
    const result = await createPresence({
      input: {
        date: '2026-07-03T00:00:00.000Z',
        status: 'present',
        userId: scenario.presence.one.userId,
        eventId: asId(scenario.presence.two.eventId),
      },
    })

    expect(result.date).toEqual(new Date('2026-07-03'))
    expect(result.status).toEqual('present')
    expect(result.userId).toEqual(scenario.presence.one.userId)
    expect((result as Presence).eventId).toEqual(scenario.presence.two.eventId)
  })

  scenario('updates a presence', async (scenario: StandardScenario) => {
    const original = (await presence({
      id: asId(scenario.presence.one.id),
    })) as Presence
    const result = await updatePresence({
      id: asId(original.id),
      input: { status: 'absent' },
    })

    expect(result.status).toEqual('absent')
  })

  scenario('deletes a presence', async (scenario: StandardScenario) => {
    const original = (await deletePresence({
      id: asId(scenario.presence.one.id),
    })) as Presence
    const result = await presence({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario('is only available for admins', async () => {
    mockCurrentUser({ id: 'u1', email: 'checkin@example.com', roles: ['checkin'] })

    expect(() => presences()).toThrow("You don't have access to do that.")
  })
})
