import type {
  MutationResolvers,
  PresenceRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const presences: QueryResolvers['presences'] = () => {
  requireAuth({ roles: ['admin'] })
  return db.presence.findMany()
}

export const presence: QueryResolvers['presence'] = ({ id }) => {
  requireAuth({ roles: ['admin'] })
  return db.presence.findUnique({
    where: { id },
  })
}

export const createPresence: MutationResolvers['createPresence'] = ({
  input,
}) => {
  requireAuth({ roles: ['admin'] })
  return db.presence.create({
    data: input,
  })
}

export const updatePresence: MutationResolvers['updatePresence'] = ({
  id,
  input,
}) => {
  requireAuth({ roles: ['admin'] })
  return db.presence.update({
    data: input,
    where: { id },
  })
}

export const deletePresence: MutationResolvers['deletePresence'] = ({ id }) => {
  requireAuth({ roles: ['admin'] })
  return db.presence.delete({
    where: { id },
  })
}

export const Presence: PresenceRelationResolvers = {
  event: (_obj, { root }) => {
    return db.presence.findUnique({ where: { id: root?.id } }).event()
  },
}
