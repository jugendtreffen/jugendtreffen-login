export const schema = gql`
  type AccomodationCheckIn {
    id: BigInt!
    date: DateTime!
    participantId: String!
    eventId: BigInt!
    event: Event!
  }

  type Query {
    accomodationCheckIns: [AccomodationCheckIn!]! @requireAuth
    accomodationCheckIn(id: BigInt!): AccomodationCheckIn @requireAuth
  }

  input CreateAccomodationCheckInInput {
    date: DateTime!
    participantId: String!
    eventId: BigInt!
  }

  input UpdateAccomodationCheckInInput {
    date: DateTime
    participantId: String
    eventId: BigInt
  }

  type Mutation {
    toggleAccommodationCheckIn(participantId: String!, date: Date!): AccomodationCheckIn! @skipAuth
  }
`
