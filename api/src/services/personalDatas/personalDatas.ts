import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { ForbiddenError } from '@redwoodjs/graphql-server'

export const personalData: QueryResolvers['personalData'] = ({ id }) => {
  const { id: userId } = context.currentUser

  if (userId !== id) {
    throw new ForbiddenError("You don't have access to this resource")
  }

  return db.personalData.findUnique({
    where: { id },
  })
}

export const createPersonalData: MutationResolvers['createPersonalData'] = ({
  input,
}) => {
  if (validateAgeUnder(input.birthdate, 18) && !input.phoneCaretakerContact) {
    throw new ForbiddenError(
      'Users under 18 must have the phonenumber of a parent registered.'
    )
  }

  return db.personalData.create({
    data: input,
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
