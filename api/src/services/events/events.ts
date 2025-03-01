import type { QueryResolvers, EventRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { UserInputError } from "@redwoodjs/graphql-server";

export const events: QueryResolvers['events'] = () => {
  return db.event.findMany()
}

export const event: QueryResolvers['event'] = async ({ id }) => {
  const event = await db.event.findUnique({
    where: { id },
  })
  if(event != null) {
    return event
  }
  throw new UserInputError('kein Event gefunden', {id})
}

export const Event: EventRelationResolvers = {
  Participation: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).Participation()
  },
}
