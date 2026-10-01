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
  sendRegistrationConfirmation: jest.fn().mockResolvedValue({}),
}))

const mockedSendConfirmation = sendRegistrationConfirmation as jest.Mock

const asUser = (roles: string[]) =>
  mockCurrentUser({ id: 'user-1', email: 'staff@example.com', roles })

const registration = (eventId: bigint, birthdate: string) => ({
  name: 'Clara',
  familyName: 'Berger',
  email: 'clara@example.com',
  birthdate: `${birthdate}T00:00:00.000Z`,
  gender: 'female',
  phoneNumber: '+43 660 7654321',
  country: 'AT',
  city: 'Linz',
  postalCode: '4020',
  address: 'Hauptplatz 1',
  accommodation: 'jugendtreffen',
  startDate: '2026-07-01T00:00:00.000Z',
  endDate: '2026-07-05T00:00:00.000Z',
  foodChoice: 'vegetarian',
  acceptPhotos: true,
  acceptCoC: true,
  participationRole: 'teilnehmer',
  // Redwood typisiert den BigInt-Scalar in den Resolver-Typen als number
  eventId: eventId as unknown as number,
})

describe('participants', () => {
  beforeEach(() => {
    mockedSendConfirmation.mockClear()
    mockedSendConfirmation.mockResolvedValue({})
  })

  describe('participants query', () => {
    for (const [role] of [['admin'], ['checkin']]) {
      scenario(
        `returns all participants for ${role}`,
        async (scenario: StandardScenario) => {
          asUser([role])
          const result = await participants()

          expect(result.length).toEqual(
            Object.keys(scenario.participant).length
          )
        }
      )
    }

    for (const [role] of [['none'], ['quartier_boys']]) {
      scenario(`is forbidden for role ${role}`, async () => {
        asUser([role])
        expect(() => participants()).toThrow(
          "You don't have access to do that."
        )
      })
    }

    scenario('requires a logged in user', async () => {
      mockCurrentUser(null)
      expect(() => participants()).toThrow(
        "You don't have permission to do that."
      )
    })
  })

  scenario(
    'returns a single participant without login (registration summary)',
    async (scenario: StandardScenario) => {
      mockCurrentUser(null)
      const result = await participant({ id: scenario.participant.one.id })

      expect(result).toEqual(scenario.participant.one)
    }
  )

  describe('createParticipant', () => {
    scenario(
      'creates a participant and sends a confirmation email',
      async (scenario: StandardScenario) => {
        const eventId = scenario.participant.one.eventId
        const result = await createParticipant({
          input: registration(eventId, '2008-05-17'),
        })

        expect(result.name).toEqual('Clara')
        expect(result.email).toEqual('clara@example.com')
        expect(result.birthdate).toEqual(new Date('2008-05-17'))
        expect(result.eventId).toEqual(eventId)
        expect(result.checkinConfirmed).toBe(false)
        expect(mockedSendConfirmation).toHaveBeenCalledWith({
          to: 'clara@example.com',
          name: 'Clara',
          participantId: result.id,
        })
      }
    )

    // Alter wird zum Eventstart (1. Juli 2026) berechnet
    for (const [birthdate, expected] of [
      ['2008-07-01', 'blue_ue18'], // genau 18
      ['2008-07-02', 'dark_green_ue16'], // 17
      ['2010-07-01', 'dark_green_ue16'], // genau 16
      ['2010-07-02', 'lime_ue14'], // 15
      ['2012-07-01', 'lime_ue14'], // 14
    ]) {
      scenario(
        `assigns the band colour for birthdate ${birthdate}`,
        async (scenario: StandardScenario) => {
          const result = await createParticipant({
            input: registration(scenario.participant.one.eventId, birthdate),
          })

          expect(result.bandColour).toEqual(expected)
        }
      )
    }

    scenario(
      'still registers the participant when the email fails',
      async (scenario: StandardScenario) => {
        mockedSendConfirmation.mockRejectedValue(new Error('Brevo down'))

        const result = await createParticipant({
          input: registration(scenario.participant.one.eventId, '2008-05-17'),
        })

        expect(await participant({ id: result.id })).not.toBeNull()
      }
    )

    scenario('rejects an unknown event', async () => {
      await expect(
        createParticipant({ input: registration(BigInt(999999), '2008-05-17') })
      ).rejects.toThrow('kein Event für angegebene Id gefunden')
      expect(mockedSendConfirmation).not.toHaveBeenCalled()
    })
  })

  describe('updateParticipant', () => {
    for (const [role] of [['admin'], ['checkin']]) {
      scenario(
        `lets ${role} check in a participant`,
        async (scenario: StandardScenario) => {
          asUser([role])
          const result = await updateParticipant({
            id: scenario.participant.one.id,
            input: { name: 'Anna-Lena', checkinConfirmed: true },
          })

          expect(result.name).toEqual('Anna-Lena')
          expect(result.checkinConfirmed).toBe(true)
        }
      )
    }

    scenario(
      'is forbidden without staff role',
      async (scenario: StandardScenario) => {
        asUser(['none'])
        expect(() =>
          updateParticipant({
            id: scenario.participant.one.id,
            input: { name: 'Hacker' },
          })
        ).toThrow("You don't have access to do that.")
      }
    )
  })

  describe('deleteParticipant', () => {
    scenario(
      'lets admins delete a participant',
      async (scenario: StandardScenario) => {
        asUser(['admin'])
        const original = (await deleteParticipant({
          id: scenario.participant.one.id,
        })) as Participant

        expect(await participant({ id: original.id })).toEqual(null)
      }
    )

    scenario('is forbidden for checkin', async (scenario: StandardScenario) => {
      asUser(['checkin'])
      expect(() =>
        deleteParticipant({ id: scenario.participant.one.id })
      ).toThrow("You don't have access to do that.")
    })
  })
})
