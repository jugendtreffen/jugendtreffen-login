export const schema = gql`
  type ParticipationRole {
    id: Int!
    desc: String!
    Participation: [Participation]!
  }

  type Query {
    participationRoles: [ParticipationRole!]! @requireAuth
  }

  input CreateParticipationRoleInput {
    desc: String!
  }

  input UpdateParticipationRoleInput {
    desc: String
  }
`
