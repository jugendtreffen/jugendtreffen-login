// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  events: [
    {
      __typename: 'events' as const,
      id: 42,
    },
    {
      __typename: 'events' as const,
      id: 43,
    },
    {
      __typename: 'events' as const,
      id: 44,
    },
  ],
})
