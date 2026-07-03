export const schema = gql`
  type StaffUser {
    id: String!
    email: String!
    role: String
  }

  type Query {
    staffUsers: [StaffUser!]! @requireAuth
  }

  input UpdateStaffRoleInput {
    userId: String!
    role: String
  }

  type Mutation {
    updateStaffRole(input: UpdateStaffRoleInput!): StaffUser! @requireAuth
  }
`
