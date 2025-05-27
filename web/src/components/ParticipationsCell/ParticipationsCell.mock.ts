// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  participations: [
    {
      __typename: "Participation" as const,
      id: 42
    },
    {
      __typename: "Participation" as const,
      id: 43
    },
    {
      __typename: "Participation" as const,
      id: 44
    }
  ]
});
