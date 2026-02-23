import type { EventRelationResolvers, QueryResolvers } from 'types/graphql'

import { RedwoodGraphQLError, UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import '../../lib/bigIntPolyfill'

export const events: QueryResolvers['events'] = () => {
  return db.event.findMany()
}

export const event: QueryResolvers['event'] = async ({ id }) => {
  const event = await db.event.findUnique({
    where: { id },
  })
  if (event != null) {
    return event
  }
  throw new UserInputError('kein Event gefunden', { id })
}

export const currentEvent: QueryResolvers['currentEvent'] = async () => {
  const now = new Date()
  logger.info(`Current Event: ${now.toISOString()}`)
  const event = await db.event
    .findFirst({
      orderBy: {
        startDate: 'asc',
      },
    })
    .catch(() => {
      throw new RedwoodGraphQLError('Kein anstehendes Event gefunden')
    })
  logger.info(`Current Event: ${JSON.stringify(event)}`)
  return event
}

export const Event: EventRelationResolvers = {
  Participants: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).participants()
  },
}
