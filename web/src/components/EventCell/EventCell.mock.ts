// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  event: {
    __typename: 'Event' as const,
    id: 42,
  },
})
