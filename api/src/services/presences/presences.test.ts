import type { Presence } from '@prisma/client'

import { db } from 'src/lib/db'
import {
  createPresence,
  deletePresence,
  presence,
  presences,
  updatePresence,
} from './presences'

const makeEvent = async (name: string) =>
  db.event.create({
    data: {
      name,
      startDate: new Date('2025-09-21T15:24:55.497Z'),
      endDate: new Date('2025-09-21T15:24:55.497Z'),
    },
  })

describe('presences', () => {
  it('returns all presences', async () => {
    const eventOne = await makeEvent(`pres-event-one-${Date.now()}`)
    const eventTwo = await makeEvent(`pres-event-two-${Date.now() + 1}`)

    await db.presence.create({
      data: {
        date: new Date('2025-09-21'),
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000001',
        eventId: eventOne.id,
      },
    })

    await db.presence.create({
      data: {
        date: new Date('2025-09-22'),
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000002',
        eventId: eventTwo.id,
      },
    })

    const result = await presences()

    expect(result.length).toEqual(2)
  })

  it('returns a single presence', async () => {
    const event = await makeEvent(`pres-event-single-${Date.now()}`)
    const created = await db.presence.create({
      data: {
        date: new Date('2025-09-21'),
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000003',
        eventId: event.id,
      },
    })

    const result = await presence({ id: created.id })

    expect(result).toEqual(created)
  })

  it('creates a presence', async () => {
    const event = await makeEvent(`pres-event-create-${Date.now()}`)
    const result = await createPresence({
      input: {
        date: new Date('2025-09-21'),
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000004',
        eventId: event.id,
      },
    })

    expect(result.date).toEqual(new Date('2025-09-21'))
    expect(result.status).toEqual('String')
    expect(result.userId).toEqual('00000000-0000-4000-8000-000000000004')
    expect(result.eventId).toEqual(event.id)
  })

  it('updates a presence', async () => {
    const event = await makeEvent(`pres-event-update-${Date.now()}`)
    const original = (await db.presence.create({
      data: {
        date: new Date('2025-09-21'),
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000005',
        eventId: event.id,
      },
    })) as Presence

    const result = await updatePresence({
      id: original.id,
      input: { date: new Date('2025-09-22') },
    })

    expect(result.date).toEqual(new Date('2025-09-22'))
  })

  it('deletes a presence', async () => {
    const event = await makeEvent(`pres-event-delete-${Date.now()}`)
    const original = (await db.presence.create({
      data: {
        date: new Date('2025-09-21'),
        status: 'String',
        userId: '00000000-0000-4000-8000-000000000006',
        eventId: event.id,
      },
    })) as Presence

    const deleted = await deletePresence({ id: original.id })
    const result = await presence({ id: deleted.id })

    expect(result).toEqual(null)
  })
})
