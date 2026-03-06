export const schema = gql`
  type Participant {
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
    travelMethod: String
    accommodation: String!
    startDate: DateTime!
    endDate: DateTime!
    foodChoice: String!
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    eventId: BigInt!
    participationRole: String
    createdAt: DateTime!
    event: Event!
  }

  type Query {
    participants: [Participant!]! @requireAuth
    participant(id: String!): Participant @requireAuth
  }

  input CreateParticipantInput {
    name: String!
    familyName: String!
    email: String!
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
    travelMethod: String
    accommodation: String!
    startDate: DateTime!
    endDate: DateTime!
    foodChoice: String!
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    eventId: BigInt!
    participationRole: String
  }

  input UpdateParticipantInput {
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
    travelMethod: String
    accommodation: String
    startDate: DateTime
    endDate: DateTime
    foodChoice: String
    acceptPhotos: Boolean
    acceptCoC: Boolean
    eventId: BigInt
    participationRole: String
  }

  type Mutation {
    createParticipant(input: CreateParticipantInput!): Participant! @skipAuth
    updateParticipant(
      id: String!
      input: UpdateParticipantInput!
    ): Participant! @requireAuth
    deleteParticipant(id: String!): Participant! @requireAuth
  }
`
