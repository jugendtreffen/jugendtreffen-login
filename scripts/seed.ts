// import { db } from 'api/src/lib/db'

// Manually apply seeds via the `yarn rw prisma db seed` command.
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info

import { db } from "api/src/lib/db";

export default async () => {
  try {
    const systemRoles = [
      {id: 0, desc: "admin"},
      {id: 1, desc: "anmeldung"},
      {id: 2, desc: "quartier"},
      {id: 3, desc: "teilnehmer"},
    ]

    const participationRoles = [
      {id: 0, desc: "Teilnehmer"},
      {id: 1, desc: "Ordensmann/Priester"},
      {id: 2, desc: "Mitarbeiter"},
      {id: 3, desc: "Begleitperson"},
      {id: 4, desc: "Vortragender"},
    ]

    const personalDatas = [
      {
        email: 'admin@jugendtreffen.at',
        name: 'admin',
        familyName: '',
        systemRole: 0,
      },
      {
        email: 'test@jugendtreffen.at',
        name: 'test',
        familyName: 'user',
        birthdate: new Date(2000, 0, 1),
        gender: 'unknown',
        systemRole: 3,
      },
    ]
    console.info('seeding systemRoles')
    for (const item of systemRoles) {
      await db.SystemRole.upsert({
        where: { id: item.id },
        update: { desc: item.desc },
        create: { id: item.id, desc: item.desc },
      })
    }
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
    console.info('seeding personalDatas')
    for (const item of personalDatas) {
      await db.PersonalData.upsert({
        where: { email: item.email },
        update: {
          email: item.email,
          name: item.name,
          familyName: item.familyName,
          role: { connect: { id: item.systemRole } },
        },
        create: {
          email: item.email,
          name: item.name,
          familyName: item.familyName,
          gender: item.gender,
          birthdate: item.birthdate,
          role: { connect: { id: item.systemRole } },
        },
      })
    }
    console.info('-> done')
  } catch (error) {
    console.error(error)
  }
}
