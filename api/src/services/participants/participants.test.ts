import type { Participant } from '@prisma/client'

import { sendRegistrationConfirmation } from 'src/services/mailer/mailer'
import {
  createParticipant,
  deleteParticipant,
  participant,
  participants,
  updateParticipant,
} from './participants'
import type { StandardScenario } from './participants.scenarios'

jest.mock('src/services/mailer/mailer', () => ({
  sendRegistrationConfirmation: jest.fn().mockResolvedValue(undefined),
}))

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('participants', () => {
  beforeEach(() => {
    jest.mocked(sendRegistrationConfirmation).mockResolvedValue(undefined as any)
  })

  scenario('returns all participants', async (scenario: StandardScenario) => {
    const result = await participants()

    expect(result.length).toEqual(Object.keys(scenario.participant).length)
  })

  scenario(
    'returns a single participant',
    async (scenario: StandardScenario) => {
      const result = await participant({ id: scenario.participant.one.id })

      expect(result).toEqual(scenario.participant.one)
    }
  )

  scenario('creates a participant', async (scenario: StandardScenario) => {
    const result = await createParticipant({
      input: {
        name: 'String',
        familyName: 'String',
        email: 'new@example.com',
        birthdate: '2026-02-23T21:05:28.445Z',
        gender: 'String',
        phoneNumber: 'String',
        country: 'String',
        city: 'String',
        postalCode: 'String',
        address: 'String',
        accommodation: 'String',
        startDate: '2026-02-23T21:05:28.445Z',
        endDate: '2026-02-24T21:05:28.445Z',
        foodChoice: 'String',
        acceptPhotos: true,
        acceptCoC: true,
        eventId: scenario.participant.two.eventId,
        participationRole: 'teilnehmer',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.familyName).toEqual('String')
    expect(result.birthdate).toEqual(new Date('2026-02-23T00:00:00.000Z'))
    expect(result.gender).toEqual('String')
    expect(result.phoneNumber).toEqual('String')
    expect(result.country).toEqual('String')
    expect(result.city).toEqual('String')
    expect(result.postalCode).toEqual('String')
    expect(result.address).toEqual('String')
    expect(result.accommodation).toEqual('String')
    expect(result.startDate).toEqual(new Date('2026-02-23T00:00:00.000Z'))
    expect(result.endDate).toEqual(new Date('2026-02-24T00:00:00.000Z'))
    expect(result.foodChoice).toEqual('String')
    expect(result.acceptPhotos).toEqual(true)
    expect(result.acceptCoC).toEqual(true)
    expect(result.price).toEqual(90)
    expect(result.eventId).toEqual(scenario.participant.two.eventId)
  })

  scenario('updates a participant', async (scenario: StandardScenario) => {
    const original = (await participant({
      id: scenario.participant.one.id,
    })) as Participant
    const result = await updateParticipant({
      id: original.id,
      input: { name: 'String2', participationRole: 'teilnehmer' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a participant', async (scenario: StandardScenario) => {
    const original = (await deleteParticipant({
      id: scenario.participant.one.id,
    })) as Participant
    const result = await participant({ id: original.id })

    expect(result).toEqual(null)
  })
})
