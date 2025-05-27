export const schema = gql`
  type SystemRole {
    id: Int!
    desc: String!
    User: [User]!
  }

  type Query {
    systemRoles: [SystemRole!]! @requireAuth
    systemRole(id: Int!): SystemRole! @requireAuth
    getSystemRoleByUserId(userId: String!): SystemRole! @requireAuth
  }
`
