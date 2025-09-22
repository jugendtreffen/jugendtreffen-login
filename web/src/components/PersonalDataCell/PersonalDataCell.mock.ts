// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  personalData: [
    {
      __typename: 'PersonalData' as const,
      id: 42,
    },
    {
      __typename: 'PersonalData' as const,
      id: 43,
    },
    {
      __typename: 'PersonalData' as const,
      id: 44,
    },
  ],
})
