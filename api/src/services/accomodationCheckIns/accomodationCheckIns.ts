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

  const participant = await db.participant.findUnique({
    where: { id: participantId },
    select: { eventId: true }
  })

  if (!participant) {
    throw new Error('Participant not found')
  }

  return db.accomodationCheckIn.create({
    data: {
      participantId,
      eventId: participant.eventId,
      date,
    }
  })
}
