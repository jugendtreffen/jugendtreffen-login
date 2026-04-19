import type {
  MutationResolvers,
  ParticipantRelationResolvers,
  QueryResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { sendRegistrationConfirmation } from 'src/services/mailer/mailer'

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
    const { email } = input
    const result = await db.participant.create({
      data: input,
    })
    logger.info(
      `Created participant with email ${email} and name ${input.name}`
    )
    await sendRegistrationConfirmation({ to: email, name: input.name })
    return result
  }

export const updateParticipant: MutationResolvers['updateParticipant'] = ({
  id,
  input,
}) => {
  return db.participant.update({
    data: input,
    where: { id },
  })
}

export const deleteParticipant: MutationResolvers['deleteParticipant'] = ({
  id,
}) => {
  return db.participant.delete({
    where: { id },
  })
}

export const Participant: ParticipantRelationResolvers = {
  event: (_obj, { root }) => {
    return db.participant.findUnique({ where: { id: root?.id } }).event()
  },
}
