import { currentEvent, event, events } from './events'
import type { StandardScenario } from './events.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('events', () => {
  scenario('returns all events', async (scenario: StandardScenario) => {
    const result = await events()

    expect(result.length).toEqual(Object.keys(scenario.event).length)
  })

  scenario('returns a single event', async (scenario: StandardScenario) => {
    const result = await event({ id: scenario.event.one.id })

    expect(result).toEqual(scenario.event.one)
  })

  scenario(
    'returns the most recent event before today',
    async (scenario: StandardScenario) => {
      const result = await currentEvent()
      // Should be the event with the latest startDate < today
      const today = new Date('2025-09-20')
      const expected = Object.values(scenario.event)
        .filter((e) => new Date(e.startDate) < today)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0]

      expect(result).toEqual(expected)
    }
  )
})
