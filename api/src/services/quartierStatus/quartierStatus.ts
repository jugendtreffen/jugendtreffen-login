import { ForbiddenError, UserInputError } from '@redwoodjs/graphql-server'
import { validate } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import {
  isEditableDay,
  QUARTIER_STATUS,
  SPECIAL_PARTICIPATION_ROLES,
} from 'src/lib/quartier'

const genderForRole = (role?: string) =>
  role === 'quartier_boys' ? 'male' : role === 'quartier_girls' ? 'female' : null

const assertGenderAllowed = (gender: string) => {
  const role = context.currentUser?.roles?.at(0)
  if (role !== 'admin' && genderForRole(role) !== gender) {
    throw new ForbiddenError('Kein Zugriff auf dieses Quartier.')
  }
}

export const quartierStatusByDate = async ({
  date,
  input,
}: {
  date: Date
  input: { gender: string; accommodation: string }
}) => {
  validate(input.gender, 'gender', { inclusion: ['male', 'female'] })
  assertGenderAllowed(input.gender)

  const participants = await db.participant.findMany({
    where: { accommodation: input.accommodation, gender: input.gender },
    select: { id: true, participationRole: true },
  })
  const ids = participants.map((p) => p.id)

  const current = await db.quartierStatus.findMany({
    where: { participantId: { in: ids }, date },
  })
  const result = current.map((s) => ({
    participantId: s.participantId,
    date: s.date,
    status: s.status,
    carriedOver: false,
  }))

  // besondere Rollen: ohne Eintrag für diesen Tag den letzten bekannten Status übernehmen
  const known = new Set(current.map((s) => s.participantId))
  const special = participants.filter(
    (p) =>
      !known.has(p.id) && SPECIAL_PARTICIPATION_ROLES.includes(p.participationRole)
  )
  if (special.length) {
    const earlier = await db.quartierStatus.findMany({
      where: { participantId: { in: special.map((p) => p.id) }, date: { lt: date } },
      orderBy: { date: 'desc' },
    })
    const latest = new Map<string, (typeof earlier)[number]>()
    for (const s of earlier) if (!latest.has(s.participantId)) latest.set(s.participantId, s)
    for (const s of latest.values()) {
      result.push({
        participantId: s.participantId,
        date,
        status: s.status,
        carriedOver: true,
      })
    }
  }
  return result
}

export const setQuartierStatus = async ({
  participantId,
  date,
  status,
}: {
  participantId: string
  date: Date
  status: string
}) => {
  requireAuth({ roles: ['admin', 'quartier_boys', 'quartier_girls'] })
  if (!(QUARTIER_STATUS as readonly string[]).includes(status)) {
    throw new UserInputError('Ungültiger Status.')
  }

  const isAdmin = context.currentUser?.roles?.includes('admin')
  if (!isAdmin && !isEditableDay(date)) {
    throw new ForbiddenError(
      'Änderungen sind nur am aktuellen Tag (bis 2 Uhr nachts) möglich.'
    )
  }

  const participant = await db.participant.findUnique({
    where: { id: participantId },
    select: { gender: true },
  })
  if (!participant) throw new UserInputError('Teilnehmer nicht gefunden.')
  assertGenderAllowed(participant.gender)

  logger.info(
    `user ${context.currentUser?.email} set quartier status of ${participantId} on ${date} to ${status}`
  )
  const saved = await db.quartierStatus.upsert({
    where: { participantId_date: { participantId, date } },
    create: {
      participantId,
      date,
      status: status as (typeof QUARTIER_STATUS)[number],
      updatedBy: context.currentUser?.email as string,
    },
    update: {
      status: status as (typeof QUARTIER_STATUS)[number],
      updatedBy: context.currentUser?.email as string,
    },
  })
  return {
    participantId: saved.participantId,
    date: saved.date,
    status: saved.status,
    carriedOver: false,
  }
}
