export const schema = gql`
  type Presence {
    id: BigInt!
    date: DateTime!
    status: String!
    userId: String!
    event: Event!
  }

  type Query {
    presences: [Presence!] @requireAuth
  }

  input CreatePresenceInput {
    date: DateTime!
    status: String!
    userId: String!
    eventId: BigInt!
  }

  input UpdatePresenceInput {
    date: DateTime
    status: String
    userId: String
    eventId: BigInt
  }

  type Mutation {
    createPresence(input: CreatePresenceInput!): Presence! @requireAuth
    updatePresence(id: BigInt!, input: UpdatePresenceInput!): Presence!
      @requireAuth
    deletePresence(id: BigInt!): Presence! @requireAuth
  }
`
