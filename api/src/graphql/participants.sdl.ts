export const schema = gql`
  type Participant {
    id: String!
    name: String!
    familyName: String!
    email: String!
    birthdate: DateTime!
    gender: String!
    phoneNumber: String!
    phoneCaretakerContact: String
    foundUsBy: String
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
    participationRole: String!
    checkinConfirmed: Boolean
    price: Float
    bandColour: String
    createdAt: DateTime!
    event: Event!
  }

  type Query {
    participants: [Participant!]! @requireAuth
    participant(id: String!): Participant @skipAuth
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
    participationRole: String!
  }

  input UpdateParticipantInput {
    name: String
    familyName: String
    email: String
    birthdate: DateTime
    gender: String
    phoneNumber: String
    phoneCaretakerContact: String
    foundUsBy: String
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
    participationRole: String!
    checkinConfirmed: Boolean
    price: Float
    bandColour: String
  }

  type Mutation {
    createParticipant(input: CreateParticipantInput!): Participant! @skipAuth
    updateParticipant(
      id: String!
      input: UpdateParticipantInput!
    ): Participant! @requireAuth
    checkinParticipant(id: String!): Participant! @requireAuth
    deleteParticipant(id: String!): Participant! @requireAuth
  }
`
