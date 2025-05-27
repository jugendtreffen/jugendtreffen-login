export const schema = gql`
  type Event {
    id: Int!
    name: String!
    desc: String
    startDate: DateTime
    endDate: DateTime
    Participation: [Participation]!
  }

  type Query {
    events: [Event!]! @skipAuth
    event(id: Int!): Event @skipAuth
    findCurrentEvent: Event @skipAuth
  }
`
