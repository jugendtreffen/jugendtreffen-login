import type { QueryResolvers, SystemRoleRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const systemRoles: QueryResolvers['systemRoles'] = () => {
  return db.systemRole.findMany()
}

export const systemRole: QueryResolvers['systemRole'] = ({ id }) => {
  return db.systemRole.findUnique({
    where: { id },
  })
}

export const SystemRole: SystemRoleRelationResolvers = {
  User: (_obj, { root }) => {
    return db.systemRole.findUnique({ where: { id: root?.id } }).User()
  },
}
