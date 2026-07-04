import type {
  AccomodationCheckInRelationResolvers,
  MutationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const accomodationCheckIns: QueryResolvers['accomodationCheckIns'] =
  () => {
    return db.accomodationCheckIn.findMany()
  }

export const accomodationCheckIn: QueryResolvers['accomodationCheckIn'] = ({
  id,
}) => {
  return db.accomodationCheckIn.findUnique({
    where: { id },
  })
}

export const toggleAccommodationCheckIn: MutationResolvers['toggleAccomodationCheckIn'] = async ({ participantId, date }) => {
  const existing = await db.accomodationCheckIn.findUnique({
    where: {
      participantId_date: {
        participantId,
        date,
      }
    }
  })

  if (existing) {
    return db.accomodationCheckIn.delete({
      where: { id: existing.id }
    })
  }
  return db.accomodationCheckIn.create({
    data: {
      participantId,
      date,
    }
  })
}
