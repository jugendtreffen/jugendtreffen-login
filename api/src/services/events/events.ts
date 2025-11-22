import type { EventRelationResolvers, QueryResolvers } from 'types/graphql'

import { RedwoodGraphQLError, UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

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
  return db.event
    .findFirst({
      where: {
        startDate: {
          lt: new Date(),
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    })
    .catch(() => {
      throw new RedwoodGraphQLError('Kein anstehendes Event gefunden')
    })
}

export const Event: EventRelationResolvers = {
  Participation: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).Participation()
  },
}
