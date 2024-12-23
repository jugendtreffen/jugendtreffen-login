export const schema = gql`
  type User {
    id: BigInt!
    email: String!
    name: String!
    familyName: String!
    birthdate: DateTime
    gender: String
    roleId: Int!
    country: String
    city: String
    postalCode: String
    address: String
    phoneNumber: String
    phoneCaretakerContact: String
    role: SystemRole!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: BigInt!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String!
    familyName: String!
    birthdate: DateTime
    gender: String
    roleId: Int!
    country: String
    city: String
    postalCode: String
    address: String
    phoneNumber: String
    phoneCaretakerContact: String
  }

  input UpdateUserInput {
    email: String
    name: String
    familyName: String
    birthdate: DateTime
    gender: String
    roleId: Int
    country: String
    city: String
    postalCode: String
    address: String
    phoneNumber: String
    phoneCaretakerContact: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @skipAuth
    updateUser(id: BigInt!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: BigInt!): User! @requireAuth
  }
`
