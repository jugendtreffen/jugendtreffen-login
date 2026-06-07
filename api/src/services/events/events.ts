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
  throw new UserInputError('kein Event für angegebene Id gefunden', { id })
}

export const currentEvent: QueryResolvers['currentEvent'] = async () => {
  try {
    return db.event.findFirst({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    })
  } catch (error) {
    logger.error('Error fetching current event: ' + error.message)
    throw new RedwoodGraphQLError(
      'Es ist ein Fehler aufgetreten: ' + error.message
    )
  }
}

export const Event: EventRelationResolvers = {
  Participants: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).participants()
  },
}
