import type { QueryResolvers, EventRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const events: QueryResolvers['events'] = () => {
  return db.event.findMany()
}

export const event: QueryResolvers['event'] = ({ id }) => {
  return db.event.findUnique({
    where: { id },
  })
}

export const Event: EventRelationResolvers = {
  Participation: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).Participation()
  },
}
