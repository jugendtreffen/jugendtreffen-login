import type {
  MutationResolvers,
  ParticipantRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { sendRegistrationConfirmation } from 'src/services/mailer/mailer'
import { event } from 'src/services/events/events'
import { getAge } from 'src/lib/utils'

const DAY_IN_MS = 24 * 60 * 60 * 1000

const calculateStayDays = (startDate: Date, endDate: Date) => {
  const normalizedStart = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
  )
  const normalizedEnd = new Date(
    Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
  )

  const differenceInDays =
    (normalizedEnd.getTime() - normalizedStart.getTime()) / DAY_IN_MS

  return Math.max(0, Math.floor(differenceInDays) + 1)
}

export const calculateParticipantPrice = async ({
  eventId,
  startDate,
  endDate,
  registrationDate = new Date(),
}: {
  eventId: bigint | number | string
  startDate: Date | string
  endDate: Date | string
  registrationDate?: Date | string
}) => {
  const eventData = await db.event.findUnique({
    where: { id: BigInt(eventId) },
  })

  const pricePerDay = (eventData as { pricePerDay?: number | null } | null)
    ?.pricePerDay
  const earlyBirdCutoff = (
    eventData as { earlyBirdCutoff?: Date | string | null } | null
  )?.earlyBirdCutoff

  if (pricePerDay == null) {
    return 0
  }

  const stayDays = calculateStayDays(new Date(startDate), new Date(endDate))
  const normalizedRegistrationDate = new Date(registrationDate)
  const hasEarlyBirdDiscount =
    earlyBirdCutoff != null &&
    normalizedRegistrationDate <= new Date(earlyBirdCutoff)

  const total = stayDays * pricePerDay

  return Number((total * (hasEarlyBirdDiscount ? 0.9 : 1)).toFixed(2))
}

export const participants: QueryResolvers['participants'] = () => {
  return db.participant.findMany()
}

export const participant: QueryResolvers['participant'] = ({ id }) => {
  return db.participant.findUnique({
    where: { id },
  })
}

export const createParticipant: MutationResolvers['createParticipant'] =
  async ({ input }) => {

  const { email, birthdate, eventId, startDate, endDate } = input
  const e = await event({ id: eventId })
  const age = getAge(new Date(birthdate), e.startDate)
  const price = await calculateParticipantPrice({
    eventId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    registrationDate: new Date(),
  })

  let bandColor = 'blue_ue18'
  if (age < 18) {
    bandColor = 'dark_green_ue16'
  }
  if (age < 16) {
    bandColor = 'lime_ue14'
  }

    const result = await db.participant.create({
      data: {
        ...input,
        price,
        bandColour: bandColor as any,
      },
    })
    logger.info(
      `Created participant with email ${email} and name ${input.name} and age ${age}`
    )
    await sendRegistrationConfirmation({ to: email, name: input.name, participantId: result.id })
    logger.info(`registration confirmation sent to ${email}`)
    return result
  }

export const updateParticipant: MutationResolvers['updateParticipant'] = ({
  id,
  input,
}) => {
  logger.info(
    `user ${context?.currentUser?.email ?? 'unknown'} updating participant with id ${id}`
  )
  return db.participant.update({
    data: input,
    where: { id },
  })
}

export const deleteParticipant: MutationResolvers['deleteParticipant'] = ({
  id,
}) => {
  logger.info(
    `user ${context?.currentUser?.email ?? 'unknown'} deleting participant with id ${id}`
  )
  return db.participant.delete({
    where: { id },
  })
}

export const Participant: ParticipantRelationResolvers = {
  event: (_obj, { root }) => {
    return db.participant.findUnique({ where: { id: root?.id } }).event()
  },
}
