import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { ForbiddenError } from '@redwoodjs/graphql-server'
import { RedwoodError } from '@redwoodjs/api'

export const personalData: QueryResolvers['personalData'] = async ({ id }) => {
  const { sub } = context.currentUser

  if (!id) {
    // @ts-ignore
    return db.personalData.findUnique({
      where: { id: sub },
    })
  }
  if (id === sub) {
    return db.personalData.findUnique({
      where: { id },
    })
  }
  throw new ForbiddenError("You don't have access to this data.")
}

export const role: QueryResolvers['role'] = async () => {
  const currentUser = context.currentUser
  const result = await db.personalData.findUnique({
    where: { id: currentUser.sub },
    select: { role },
  })
  if (!result) throw new RedwoodError('Something went wrong')
  return result.role
}

export const findOrCreatePersonalData: MutationResolvers['findOrCreatePersonalData'] =
  async ({ input }) => {
    const exisiting = await db.personalData.findFirst({
      where: {
        name: input.name,
        familyName: input.familyName,
        birthdate: new Date(input.birthdate),
      }
    })
    if (exisiting) {
      return exisiting
    }

    // await validateWith(() => {
    //   if (validateAgeUnder(input.birthdate, 18) && !input.phoneCaretakerContact) {
    //     return new ForbiddenError(
    //       'Teilnehmer unter 18 müssen die Telefonnummer eines erziehungsberechtigten angeben.'
    //     )
    //   }
    //   if (validateAgeUnder(input.birthdate, 14)) {
    //     return new ForbiddenError(
    //       'Du musst mindestens 14 Jahre Alt sein!'
    //     )
    //   }
    // })

    return db.personalData.create( {
      data: input
    })
  }

export const updatePersonalData: MutationResolvers['updatePersonalData'] = ({
  id,
  input,
}) => {
  return db.personalData.update({
    data: input,
    where: { id },
  })
}

export const deletePersonalData: MutationResolvers['deletePersonalData'] = ({
  id,
}) => {
  return db.personalData.delete({
    where: { id },
  })
}

export const personalDataByNameAndBirthdate: MutationResolvers['personalDataByNameAndBirthdate'] = ({
  name, familyName, birthdate,
}) => {
  return db.personalData.findFirst({
    where: {
      name: name,
      familyName: familyName,
      birthdate: new Date(birthdate)
    }
  })
}

function validateAgeUnder(birthdate: Date, ageLimit: number) {
  const today = new Date()
  const age = today.getFullYear() - birthdate.getFullYear()
  const monthDifference = today.getMonth() - birthdate.getMonth()
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthdate.getDate())
  ) {
    return age - 1 < ageLimit
  }
  return age < ageLimit
}

