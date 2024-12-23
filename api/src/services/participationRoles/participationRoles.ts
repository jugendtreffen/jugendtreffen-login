import type {
  QueryResolvers,
  ParticipationRoleRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const participationRoles: QueryResolvers['participationRoles'] = () => {
  return db.participationRole.findMany()
}

export const participationRole: QueryResolvers['participationRole'] = ({
  id,
}) => {
  return db.participationRole.findUnique({
    where: { id },
  })
}

export const ParticipationRole: ParticipationRoleRelationResolvers = {
  Participation: (_obj, { root }) => {
    return db.participationRole
      .findUnique({ where: { id: root?.id } })
      .Participation()
  },
}
