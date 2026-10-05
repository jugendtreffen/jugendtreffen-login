import { BandColourEnum } from '@prisma/client'
import type {
  MutationResolvers,
  ParticipantRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { getAge } from 'src/lib/utils'
import { event } from 'src/services/events/events'
import { sendRegistrationConfirmation } from 'src/services/mailer/mailer'

// Teilnehmerdaten (personenbezogen) dürfen nur Admins und das Check-in-Team sehen
const PARTICIPANT_STAFF_ROLES = ['admin', 'checkin']

export const participants: QueryResolvers['participants'] = () => {
  requireAuth({ roles: PARTICIPANT_STAFF_ROLES })
  return db.participant.findMany()
}

export const participant: QueryResolvers['participant'] = ({ id }) => {
  return db.participant.findUnique({
    where: { id },
  })
}

export const createParticipant: MutationResolvers['createParticipant'] =
  async ({ input }) => {

  const { email, birthdate, eventId } = input
    const e = await event({id: eventId})
    const age = getAge(new Date(birthdate), e.startDate)

    let bandColor: BandColourEnum = BandColourEnum.blue_ue18
    if(age < 18) {
      bandColor = BandColourEnum.dark_green_ue16
    } if(age < 16) {
      bandColor = BandColourEnum.lime_ue14
    }

    const result = await db.participant.create({
      data: {
        ...input,
        bandColour: bandColor
      },
    })
    logger.info(
      `Created participant with email ${email} and name ${input.name} and age ${age}`
    )
    try {
      await sendRegistrationConfirmation({ to: email, name: input.name, participantId: result.id })
      logger.info(`registration confirmation sent to ${email}`)
    } catch (error) {
      // Die Anmeldung ist gespeichert – ein Mailfehler darf sie nicht als fehlgeschlagen melden,
      // sonst melden sich Teilnehmer doppelt an.
      logger.error(`registration confirmation to ${email} failed: ${error.message}`)
    }
    return result
  }

export const updateParticipant: MutationResolvers['updateParticipant'] = ({
  id,
  input,
}) => {
  requireAuth({ roles: PARTICIPANT_STAFF_ROLES })
  logger.info(`user ${context.currentUser.email} updating participant with id ${id}`)
  return db.participant.update({
    data: input,
    where: { id },
  })
}

export const deleteParticipant: MutationResolvers['deleteParticipant'] = ({
  id,
}) => {
  requireAuth({ roles: ['admin'] })
  logger.info(`user ${context.currentUser.email} deleting participant with id ${id}`)
  return db.participant.delete({
    where: { id },
  })
}

export const Participant: ParticipantRelationResolvers = {
  event: (_obj, { root }) => {
    return db.participant.findUnique({ where: { id: root?.id } }).event()
  },
}
