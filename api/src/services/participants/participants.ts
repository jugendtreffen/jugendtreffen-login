import type {
  MutationResolvers,
  ParticipantRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { BandColourEnum } from '@prisma/client'
import { logger } from 'src/lib/logger'
import { sendRegistrationConfirmation } from 'src/services/mailer/mailer'
import {event} from "src/services/events/events";
import { getAge} from "src/lib/utils";

export const participants: QueryResolvers['participants'] = () => {
  return db.participant.findMany()
}

export const participant: QueryResolvers['participant'] = ({ id }) => {
  return db.participant.findUnique({
    where: { id },
  })
}

export const participantByAccomodation: QueryResolvers['participantByAccommodation'] = ({ gender, accommodation }) => {
  return db.participant.findMany({
    where: { accommodation, gender },
  })
}

export const createParticipant: MutationResolvers['createParticipant'] =
  async ({ input }) => {

  const { email, birthdate, eventId } = input
    const e = await event({id: eventId})
    const age = getAge(new Date(birthdate), e.startDate)

    let bandColor = BandColourEnum.blue_ue18
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
    await sendRegistrationConfirmation({ to: email, name: input.name, participantId: result.id })
    logger.info(`registration confirmation sent to ${email}`)
    return result
  }

export const updateParticipant: MutationResolvers['updateParticipant'] = ({
  id,
  input,
}) => {
  logger.info(`user ${context.currentUser.email} updating participant with id ${id}`)
  return db.participant.update({
    data: input,
    where: { id },
  })
}

export const deleteParticipant: MutationResolvers['deleteParticipant'] = ({
  id,
}) => {
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
