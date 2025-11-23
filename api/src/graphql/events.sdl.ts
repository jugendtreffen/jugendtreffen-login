export const schema = gql`
  type Event {
    id: BigInt!
    name: String!
    desc: String
    startDate: DateTime
    endDate: DateTime
  }

  type Query {
    events: [Event!] @skipAuth
    event(id: BigInt!): Event! @skipAuth
    currentEvent: Event! @skipAuth
  }
`
