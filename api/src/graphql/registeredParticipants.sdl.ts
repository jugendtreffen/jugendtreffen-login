export const schema = gql`
  type RegisteredParticipant {
    id: String!
    name: String!
    familyName: String!
    birthdate:  Date!
    gender: String!
    phoneNumber:  String!
    phoneCaretakerContact: String
    foundUsBy:  String
    isParent: Boolean!
    country:  String!
    city: String!
    postalCode: String!
    address:  String!
    travelMethod: String
    accommodation:  String!
    startDate:  Date!
    endDate:  Date!
    foodChoice: String!
    helpAfterwards: Boolean!
    acceptPhotos: Boolean!
    acceptCoC:  Boolean!
    eventId:  Int!
    participationRole:  String
    createdAt:  DateTime
  }

  type Query {
    participationsByUser(userId: String!): [RegisteredParticipant!] @requireAuth
    participantsByEvent(eventId: Int!): [RegisteredParticipant!] @requireAuth
    particicantsByRole(role: String!): [RegisteredParticipant!] @requireAuth
    participation(id: String!): RegisteredParticipant @requireAuth
  }

  input CreateRegisteredParticipantInput {
    name: String!
    familyName: String!
    birthdate:  Date!
    gender: String!
    phoneNumber:  String!
    phoneCaretakerContact: String
    foundUsBy:  String
    isParent: Boolean!
    country:  String!
    city: String!
    postalCode: String!
    address:  String!
    travelMethod: String
    accommodation:  String!
    startDate:  Date!
    endDate:  Date!
    foodChoice: String!
    helpAfterwards: Boolean!
    acceptPhotos: Boolean!
    acceptCoC:  Boolean!
    eventId: Int!
    participationRole:  String
  }

  input UpdateRegisteredParticipantInput {
    name: String
    familyName: String
    birthdate:  Date
    gender: String
    phoneNumber:  String
    phoneCaretakerContact: String
    foundUsBy:  String
    isParent: Boolean!
    country:  String
    city: String
    postalCode: String
    address:  String
    travelMethod: String
    accommodation:  String
    startDate:  Date
    endDate:  Date
    foodChoice: String
    helpAfterwards: Boolean!
    acceptPhotos: Boolean!
    acceptCoC:  Boolean!
    participationRole:  String
  }

  type Mutation {
    createRegisteredParticipant(input: CreateRegisteredParticipantInput!): RegisteredParticipant!
      @skipAuth
    updateRegisteredParticipant(
      id: String!
      input: UpdateRegisteredParticipantInput!
    ): RegisteredParticipant! @requireAuth
    deleteRegisteredParticipant(id: String!): RegisteredParticipant! @requireAuth
  }
`
