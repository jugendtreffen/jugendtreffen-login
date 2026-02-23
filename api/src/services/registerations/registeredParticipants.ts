import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const registeredParticipantsByEvent: QueryResolvers['registeredParticipantsByEvent'] =
  async ({ eventId }) => {
    return await db.registeredParticipant.findMany({
      where: { eventId },
    })
  }

export const registeredParticipant: QueryResolvers['registeredParticipant'] = ({
  id,
}) => {
  return db.registeredParticipant.findUnique({
    where: { id },
  })
}

export const createRegisteredParticipant: MutationResolvers['createRegisteredParticipant'] =
  async ({ input }) => {
    logger.error('hier')
    const result = await db.registeredParticipant.create({
      data: {
        name: input.name,
        familyName: input.familyName,
        birthdate: input.birthdate,
        gender: input.gender,
        phoneNumber: input.phoneNumber,
        phoneCaretakerContact: input.phoneCaretakerContact,
        foundUsBy: input.foundUsBy,
        isParent: input.isParent,
        country: input.country,
        city: input.city,
        postalCode: input.postalCode,
        address: input.address,
        travelMethod: input.travelMethod,
        accommodation: input.accommodation,
        startDate: input.startDate,
        endDate: input.endDate,
        foodChoice: input.foodChoice,
        acceptPhotos: input.acceptPhotos,
        acceptCoC: input.acceptCoC,
        participationRole: input.participationRole,
        event: {
          connect: { id: Number(input.eventId) },
        },
      },
    })
    console.log('log ' + result)
    return result
  }

export const updateRegisteredParticipant: MutationResolvers['updateRegisteredParticipant'] =
  ({ id, input }) => {
    return db.registeredParticipant.update({
      data: input,
      where: { id },
    })
  }

export const deleteParticipation: MutationResolvers['deleteParticipation'] = ({
  id,
}) => {
  return db.registeredParticipant.delete({
    where: { id },
  })
}

export const Participation: ParticipationRelationResolvers = {
  event: (_obj, { root }) => {
    return db.registeredParticipant
      .findUnique({ where: { id: root?.id } })
      .event()
  },
  participationRole: (_obj, { root }) => {
    return db.registeredParticipant
      .findUnique({ where: { id: root?.id } })
      .participationRole()
  },
}
