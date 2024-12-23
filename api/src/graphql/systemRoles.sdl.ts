export const schema = gql`
  type SystemRole {
    id: Int!
    desc: String!
    User: [User]!
  }

  type Query {
    systemRoles: [SystemRole!]! @requireAuth
  }

  input CreateSystemRoleInput {
    desc: String!
  }

  input UpdateSystemRoleInput {
    desc: String
  }
`
