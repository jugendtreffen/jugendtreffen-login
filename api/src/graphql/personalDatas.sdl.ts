export const schema = gql`
  type PersonalData {
    id: String!
    name: String!
    familyName: String!
    birthdate: DateTime!
    gender: String!
    phoneNumber: String!
    phoneCaretakerContact: String
    foundUsBy: String
    isParent: Boolean!
    country: String!
    city: String!
    postalCode: String!
    address: String!
    role: String!
    createdAt: DateTime!
  }

  type Query {
    personalData(id: String): PersonalData @requireAuth
    role: String! @requireAuth
  }

  input CreatePersonalDataInput {
    id: String!
    name: String!
    familyName: String!
    birthdate: DateTime!
    gender: String!
    phoneNumber: String!
    phoneCaretakerContact: String
    foundUsBy: String
    isParent: Boolean
    country: String!
    city: String!
    postalCode: String!
    address: String!
    role: String!
  }

  input UpdatePersonalDataInput {
    id: String!
    name: String
    familyName: String
    birthdate: DateTime
    gender: String
    phoneNumber: String
    phoneCaretakerContact: String
    foundUsBy: String
    isParent: Boolean
    country: String
    city: String
    postalCode: String
    address: String
    role: String
  }

  type Mutation {
    createPersonalData(input: CreatePersonalDataInput!): PersonalData! @skipAuth
    updatePersonalData(
      id: String!
      input: UpdatePersonalDataInput!
    ): PersonalData! @requireAuth
    deletePersonalData(id: String!): PersonalData! @requireAuth
  }
`
