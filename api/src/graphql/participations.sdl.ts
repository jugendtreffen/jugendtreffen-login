export const schema = gql`
  type Participation {
    id: BigInt!
    travelMethod: String
    participationRole: String!
    accommodation: String!
    startDate: DateTime!
    endDate: DateTime!
    foodChoice: String!
    foundUsBy: String
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    event: Event!
    userId: String!
  }

  type Query {
    participationsByUser(userId: String!): [Participation!] @requireAuth
    participationsByEvent(eventId: BigInt!): [Participation!] @requireAuth
    participation(id: BigInt): Participation @requireAuth
  }

  input CreateParticipationInput {
    travelMethod: String
    participationRole: String!
    needsAccommodation: Boolean!
    accommodationPreference: String!
    startDate: DateTime!
    endDate: DateTime!
    foodChoice: String!
    foundUsBy: String
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    eventId: Int!
    userId: String!
  }

  input UpdateParticipationInput {
    travelMethod: String
    participationRole: String
    needsAccommodation: Boolean
    accommodationPreference: String
    startDate: DateTime
    endDate: DateTime
    foodChoice: String
    foundUsBy: String
    acceptPhotos: Boolean
    acceptCoC: Boolean
    eventId: Int!
    userId: String!
  }

  type Mutation {
    createParticipation(input: CreateParticipationInput!): Participation!
      @requireAuth
    updateParticipation(
      id: BigInt!
      input: UpdateParticipationInput!
    ): Participation! @requireAuth
    deleteParticipation(id: BigInt!): Participation! @requireAuth
  }
`
