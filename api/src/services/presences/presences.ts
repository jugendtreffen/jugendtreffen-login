import type {
  MutationResolvers,
  PresenceRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const presences: QueryResolvers['presences'] = () => {
  return db.presence.findMany()
}

export const presence: QueryResolvers['presence'] = ({ id }) => {
  return db.presence.findUnique({
    where: { id },
  })
}

export const createPresence: MutationResolvers['createPresence'] = ({
  input,
}) => {
  return db.presence.create({
    data: input,
  })
}

export const updatePresence: MutationResolvers['updatePresence'] = ({
  id,
  input,
}) => {
  return db.presence.update({
    data: input,
    where: { id },
  })
}

export const deletePresence: MutationResolvers['deletePresence'] = ({ id }) => {
  return db.presence.delete({
    where: { id },
  })
}

export const Presence: PresenceRelationResolvers = {
  event: (_obj, { root }) => {
    return db.presence.findUnique({ where: { id: root?.id } }).event()
  },
}
