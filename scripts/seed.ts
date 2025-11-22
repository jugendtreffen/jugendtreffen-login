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
    const systemRoles = [
      { id: 0, desc: 'admin' },
      { id: 1, desc: 'anmeldung' },
      { id: 2, desc: 'quartier' },
      { id: 3, desc: 'teilnehmer' },
    ]

    const participationRoles = [
      { id: 0, desc: 'Teilnehmer' },
      { id: 1, desc: 'Priester' },
      { id: 2, desc: 'Mitarbeiter' },
      { id: 3, desc: 'Begleitperson' },
      { id: 4, desc: 'Vortragender' },
      { id: 5, desc: 'Ordensmann/Ordensfrau' },
    ]

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
    console.info('seeding systemRoles')
    await Promise.all(
      systemRoles.map((item) =>
        db.systemRole.upsert({
          where: { desc: item.desc },
          update: {},
          create: item,
        })
      )
    )
    console.info('-> done')
    console.info('seeding ParticipationRoles')
    for (const item of participationRoles) {
      await db.ParticipationRole.upsert({
        where: { id: item.id },
        update: { desc: item.desc },
        create: { id: item.id, desc: item.desc },
      })
    }
    console.info('-> done')
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
