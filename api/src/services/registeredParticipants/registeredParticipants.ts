import type { MutationResolvers, RegisteredParticipantsResolvers, QueryResolvers } from "types/graphql";

import { db } from "src/lib/db";
import { logger } from "src/lib/logger";

export const registeredParticipantsByEvent: QueryResolvers['registeredParticipantsByEvent'] = async ({
  eventId,
}) => {
  return await db.registeredParticipants.findMany({
    where: { eventId },
  })
}

export const registeredParticipant: QueryResolvers['registeredParticipant'] = ({ id }) => {
  return db.registeredParticipants.findUnique({
    where: { id },
  })
}

export const createParticipation: MutationResolvers['createRegisteredParticipant'] = ({
  input,
}) => {
  logger.error("hier")
  const result = db.registeredParticipants.create({
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
      eventId: input.eventId,
      event: {
        connect: { id: input.eventId },
      }
    }
  })
  console.log("log " + result)
  return result
}

export const updateRegisteredParticipant: MutationResolvers['updateRegisteredParticipant'] = ({
  id,
  input,
}) => {
  return db.participation.update({
    data: input,
    where: { id },
  })
}

export const deleteParticipation: MutationResolvers['deleteParticipation'] = ({
  id,
}) => {
  return db.participation.delete({
    where: { id },
  })
}

export const Participation: ParticipationRelationResolvers = {
  event: (_obj, { root }) => {
    return db.participation.findUnique({ where: { id: root?.id } }).event()
  },
  participationRole: (_obj, { root }) => {
    return db.participation
      .findUnique({ where: { id: root?.id } })
      .participationRole()
  },
}
