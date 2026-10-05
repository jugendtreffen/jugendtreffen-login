export const schema = gql`
  type QuartierStatus {
    participantId: String!
    date: Date!
    status: String!
    "true, wenn der Status vom Vortag übernommen wurde (besondere Rollen)"
    carriedOver: Boolean!
  }

  type Query {
    quartierStatusByDate(
      date: Date!
      input: AccommodationInput!
    ): [QuartierStatus!]! @requireAuth(roles: ["admin", "quartier_boys", "quartier_girls"])
  }

  type Mutation {
    setQuartierStatus(
      participantId: String!
      date: Date!
      status: String!
    ): QuartierStatus! @requireAuth(roles: ["admin", "quartier_boys", "quartier_girls"])
  }
`
