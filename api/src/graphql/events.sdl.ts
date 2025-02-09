export const schema = gql`
  type Event {
    id: Int!
    name: String!
    desc: String
    Participation: [Participation]!
  }

  type Query {
    events: [Event!]! @requireAuth
    event(id: Int!): Event @requireAuth
  }

  input CreateEventInput {
    name: String!
    desc: String
  }

  input UpdateEventInput {
    name: String
    desc: String
  }
`
