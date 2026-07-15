export const schema = gql`
  type Presence {
    id: BigInt!
    date: DateTime!
    participantId: String!
    participant: Participant
    eventId: BigInt!
    event: Event
  }

  type Query {
    presences: [Presence!] @requireAuth
    presencesByDate(date: DateTime!): [Presence!] @requireAuth
    presencesByParticipant(participantId: String!): [Presence!] @requireAuth
  }

  input CreatePresenceInput {
    date: DateTime!
    participantId: String!
    eventId: BigInt!
  }

  input UpdatePresenceInput {
    date: DateTime
    participantId: String
    eventId: BigInt
  }

  type Mutation {
    createPresence(input: CreatePresenceInput!): Presence! @skipAuth
    updatePresence(id: BigInt!, input: UpdatePresenceInput!): Presence!
      @requireAuth
    deletePresence(id: BigInt!): Presence! @requireAuth
  }
`
