// import { db } from 'api/src/lib/db'

// Manually apply seeds via the `yarn rw prisma db seed` command.
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info

import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const events = [
      {
        id: 0,
        name: 'Jugendtreffen 2025',
        description:
          'Hier kann eine Beschreibung über das jeweilige Event stehen',
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 0, 7),
      },
    ]
    console.info('seeding events')
    for (const item of events) {
      await db.Event.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          desc: item.description,
          startDate: item.startDate,
          endDate: item.endDate,
        },
        create: {
          id: item.id,
          name: item.name,
          desc: item.description,
          startDate: item.startDate,
          endDate: item.endDate,
        },
      })
    }
  } catch (error) {
    console.error(error)
  }
}
