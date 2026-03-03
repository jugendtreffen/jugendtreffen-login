// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  eventRegistration: {
    __typename: 'EventRegistration' as const,
    id: 42,
  },
})
