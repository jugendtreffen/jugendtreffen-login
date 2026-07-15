import type {
  MutationResolvers,
  PresenceRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import {logger} from "src/lib/logger";

export const presences: QueryResolvers['presences'] = () => {
  return db.presence.findMany()
}

export const presencesByDate: QueryResolvers['presencesByDate'] = ({ date }) => {
  return db.presence.findMany({
    where: { date },
  })
}

export const presencesByParticipant: QueryResolvers['presencesByParticipant'] = ({ participantId }) => {
  return db.presence.findMany({
    where: { participantId },
  })
}

export const createPresence: MutationResolvers['createPresence'] = ({
  input,
}) => {
  logger.info(`user ${context.currentUser.email} created presence for ${input.participantId} on ${input.date}`)
  return db.presence.create({
    data: input,
  })
}

export const updatePresence: MutationResolvers['updatePresence'] = ({
  id,
  input,
}) => {
  logger.info(`user ${context.currentUser.email} updating presence with id ${id}`)
  return db.presence.update({
    data: input,
    where: { id },
  })
}

export const deletePresence: MutationResolvers['deletePresence'] = ({ id }) => {
  logger.info(`user ${context.currentUser.email} deleting presence with id ${id}`)
  return db.presence.delete({
    where: { id },
  })
}

export const Presence: PresenceRelationResolvers = {
  event: (_obj, { root }) => {
    return db.presence.findUnique({ where: { id: root?.id } }).event()
  },
}
