import { participationRole, participationRoles } from "./participationRoles";
import type { StandardScenario } from "./participationRoles.scenarios";

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('participationRoles', () => {
  scenario(
    'returns all participationRoles',
    async (scenario: StandardScenario) => {
      const result = await participationRoles()

      expect(result.length).toEqual(
        Object.keys(scenario.participationRole).length
      )
    }
  )

  scenario(
    'returns a single participationRole',
    async (scenario: StandardScenario) => {
      const result = await participationRole({
        id: scenario.participationRole.one.id,
      })

      expect(result).toEqual(scenario.participationRole.one)
    }
  )
})
