import { currentEvent, event, events } from './events'
import type { StandardScenario } from './events.scenarios'

// Redwood typisiert den BigInt-Scalar in den Resolver-Typen als number
const asId = (id: bigint) => id as unknown as number

describe('events', () => {
  scenario('returns all events', async (scenario: StandardScenario) => {
    const result = await events()

    expect(result.length).toEqual(Object.keys(scenario.event).length)
  })

  scenario('returns a single event', async (scenario: StandardScenario) => {
    const result = await event({ id: asId(scenario.event.next.id) })

    expect(result).toEqual(scenario.event.next)
  })

  scenario('throws for an unknown event id', async () => {
    await expect(event({ id: 999999 })).rejects.toThrow(
      'kein Event für angegebene Id gefunden'
    )
  })

  scenario(
    'returns the next upcoming event as current event',
    async (scenario: StandardScenario) => {
      const result = await currentEvent()

      expect(result).toEqual(scenario.event.next)
    }
  )

  scenario(
    'running',
    'returns an event that ends today',
    async (scenario: StandardScenario) => {
      const result = await currentEvent()

      expect(result).toEqual(scenario.event.current)
    }
  )

  scenario('onlyPast', 'returns null when no event is upcoming', async () => {
    expect(await currentEvent()).toBeNull()
  })
})
