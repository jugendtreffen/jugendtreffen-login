export const schema = gql`
  type ParticipationRole {
    id: Int!
    desc: String!
    references: [Participation]!
  }

  type Query {
    participationRoles: [ParticipationRole!]! @requireAuth
    participationRole(id: Int!): ParticipationRole @requireAuth
  }
`
