export const schema = gql`
  type Participation {
    id: BigInt!
    travelMethod: String
    participationRoleId: Int
    accommodation: Boolean
    accommodationLocation: String
    startDate: DateTime!
    endDate: DateTime!
    foodChoice: String!
    helpAfterwards: Boolean
    foundUsBy: String
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    eventId: Int
    event: Event
    participationRole: ParticipationRole
  }

  type Query {
    participations: [Participation!]! @requireAuth
    participation(id: BigInt!): Participation @requireAuth
  }

  input CreateParticipationInput {
    travelMethod: String
    participationRoleId: Int
    accommodation: Boolean
    accommodationLocation: String
    startDate: DateTime!
    endDate: DateTime!
    foodChoice: String!
    helpAfterwards: Boolean
    foundUsBy: String
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    eventId: Int
  }

  input UpdateParticipationInput {
    travelMethod: String
    participationRoleId: Int
    accommodation: Boolean
    accommodationLocation: String
    startDate: DateTime
    endDate: DateTime
    foodChoice: String
    helpAfterwards: Boolean
    foundUsBy: String
    acceptPhotos: Boolean
    acceptCoC: Boolean
    eventId: Int
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
