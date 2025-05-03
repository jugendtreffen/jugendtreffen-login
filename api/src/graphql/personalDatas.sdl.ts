export const schema = gql`
  type PersonalData {
    id: BigInt!
    name: String!
    familyName: String!
    birthdate: DateTime
    gender: String
    country: String
    city: String
    postalCode: String
    address: String
    phoneNumber: String
    phoneCaretakerContact: String
    userId: String
    role: SystemRole!
  }

  type UserData {
    userId: String!,
    name: String,
    familyName: String,
    role: SystemRole!,
    isParent: Boolean
  }

  type Query {
    personalDatas: [PersonalData!]! @requireAuth
    personalData(id: BigInt!): PersonalData @requireAuth
    getPersonalDataByUserId(userId: String!): UserData! @requireAuth
  }

  input CreatePersonalDataInput {
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
    userId: String
  }

  input UpdatePersonalDataInput {
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
    userId: String
  }

  type Mutation {
    createPersonalData(input: CreatePersonalDataInput!): PersonalData! @skipAuth
    updatePersonalData(
      id: BigInt!
      input: UpdatePersonalDataInput!
    ): PersonalData! @requireAuth
    deletePersonalData(id: BigInt!): PersonalData! @requireAuth
  }
`
