export const schema = gql`
  type Event {
    id: Int!
    name: String!
    desc: String
    Participation: [Participation]!
  }

  type Query {
    events: [Event!]! @skipAuth
    event(id: Int!): Event @skipAuth
  }
`
