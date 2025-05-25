import type { MutationResolvers, PersonalDataRelationResolvers, QueryResolvers } from "types/graphql";

import { db } from "src/lib/db";

export const personalDatas: QueryResolvers['personalDatas'] = () => {
  return db.personalData.findMany()
}

export const personalData: QueryResolvers['personalData'] = ({ id }) => {
  return db.personalData.findUnique({
    where: { id },
  })
}

export const personalDataByUserId: QueryResolvers["personalDataByUserId"] = ({ userId }) => {
  return db.personalData.findUnique({
    where: { userId },
    select: {
      name: true,
      familyName: true,
      isParent: true,
      role: true
    }
  });
};

export const createPersonalData: MutationResolvers['createPersonalData'] = ({
  input,
}) => {
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

export const PersonalData: PersonalDataRelationResolvers = {
  role: (_obj, { root }) => {
    return db.personalData.findUnique({ where: { id: root?.id } }).role()
  },
}
