// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  participant: {
    __typename: 'Participant' as const,
    id: '42',
  },
})
