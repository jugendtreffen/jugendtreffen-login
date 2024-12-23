import type { SystemRole } from '@prisma/client'

import { systemRoles } from './systemRoles'
import type { StandardScenario } from './systemRoles.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('systemRoles', () => {
  scenario('returns all systemRoles', async (scenario: StandardScenario) => {
    const result = await systemRoles()

    expect(result.length).toEqual(Object.keys(scenario.systemRole).length)
  })
})
