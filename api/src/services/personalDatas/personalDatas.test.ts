import type { PersonalData } from '@prisma/client'

import {
  createPersonalData,
  deletePersonalData,
  personalData,
  personalDatas,
  updatePersonalData,
} from './personalDatas'
import type { StandardScenario } from './personalDatas.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('personalDatas', () => {
  scenario('returns all personalDatas', async (scenario: StandardScenario) => {
    const result = await personalDatas()

    expect(result.length).toEqual(Object.keys(scenario.personalData).length)
  })

  scenario(
    'returns a single personalData',
    async (scenario: StandardScenario) => {
      const result = await personalData({ id: scenario.personalData.one.id })

      expect(result).toEqual(scenario.personalData.one)
    }
  )

  scenario('creates a personalData', async () => {
    const result = await createPersonalData({
      input: {
        id: 'String',
        name: 'String',
        familyName: 'String',
        userId: 'String4370654',
        role: 'String',
      },
    })

    expect(result.id).toEqual('String')
    expect(result.name).toEqual('String')
    expect(result.familyName).toEqual('String')
    expect(result.userId).toEqual('String4370654')
    expect(result.role).toEqual('String')
  })

  scenario('updates a personalData', async (scenario: StandardScenario) => {
    const original = (await personalData({
      id: scenario.personalData.one.id,
    })) as PersonalData
    const result = await updatePersonalData({
      id: original.id,
      input: { id: 'String2' },
    })

    expect(result.id).toEqual('String2')
  })

  scenario('deletes a personalData', async (scenario: StandardScenario) => {
    const original = (await deletePersonalData({
      id: scenario.personalData.one.id,
    })) as PersonalData
    const result = await personalData({ id: original.id })

    expect(result).toEqual(null)
  })
})
