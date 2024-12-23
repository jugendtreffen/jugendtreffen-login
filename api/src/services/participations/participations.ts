import type {
  QueryResolvers,
  MutationResolvers,
  ParticipationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const participations: QueryResolvers['participations'] = () => {
  return db.participation.findMany()
}

export const participation: QueryResolvers['participation'] = ({ id }) => {
  return db.participation.findUnique({
    where: { id },
  })
}

export const createParticipation: MutationResolvers['createParticipation'] = ({
  input,
}) => {
  return db.participation.create({
    data: input,
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
  participationRole: (_obj, { root }) => {
    return db.participation
      .findUnique({ where: { id: root?.id } })
      .participationRole()
  },
}
