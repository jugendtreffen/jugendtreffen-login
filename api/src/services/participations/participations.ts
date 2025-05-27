import type {
  MutationResolvers,
  ParticipationRelationResolvers,
  QueryResolvers
} from "types/graphql";

import { db } from "src/lib/db";

export const participations: QueryResolvers['participations'] = () => {
  return db.participation.findMany()
}

export const participation: QueryResolvers['participation'] = ({ id }) => {
  return db.participation.findUnique({
    where: { id },
  })
}

export const getParticipationByUserId: QueryResolvers["participationsByUserId"] =
  async ({ userId }) => {
    const participations = await db.participation.findMany({
      where: { userId },
      include: { event: true, participationRole: true }
    });

    return participations;
  }

export const createParticipation: MutationResolvers['createParticipation'] = ({
  input,
}) => {
  return db.participation.create({
    data: {
      travelMethod: input.travelMethod,
      accommodation: input.accommodation,
      accomodationLocation: input.accommodationLocation,
      startDate: input.startDate,
      endDate: input.endDate,
      foodChoice: input.foodChoice,
      helpAfterwards: input.helpAfterwards,
      acceptCoC: input.acceptCoC,
      acceptPhotos: input.acceptPhotos,
      participationRole: {
        connect: { id: input.participationRoleId }
      },
      event: {
        connect: { id: input.eventId }
      },
      userId: input.userId
    },
  })
}

export const updateParticipation: MutationResolvers['updateParticipation'] = ({
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
