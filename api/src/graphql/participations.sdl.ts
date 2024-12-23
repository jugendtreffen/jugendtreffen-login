export const schema = gql`
  type Participation {
    id: BigInt!
    year: Int!
    travelMethod: String
    participationRoleId: Int
    accomodation: Boolean
    arrival: DateTime!
    departure: DateTime!
    helpAfterwards: Boolean
    foundUsBy: String
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
    participationRole: ParticipationRole
  }

  type Query {
    participations: [Participation!]! @requireAuth
    participation(id: BigInt!): Participation @requireAuth
  }

  input CreateParticipationInput {
    year: Int!
    travelMethod: String
    participationRoleId: Int
    accomodation: Boolean
    arrival: DateTime!
    departure: DateTime!
    helpAfterwards: Boolean
    foundUsBy: String
    acceptPhotos: Boolean!
    acceptCoC: Boolean!
  }

  input UpdateParticipationInput {
    year: Int
    travelMethod: String
    participationRoleId: Int
    accomodation: Boolean
    arrival: DateTime
    departure: DateTime
    helpAfterwards: Boolean
    foundUsBy: String
    acceptPhotos: Boolean
    acceptCoC: Boolean
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
