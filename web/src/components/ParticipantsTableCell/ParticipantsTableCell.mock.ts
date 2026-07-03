// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  participants: [
    {
      __typename: 'Participant' as const,
      id: '42',
    },
    {
      __typename: 'Participant' as const,
      id: '43',
    },
    {
      __typename: 'Participant' as const,
      id: '44',
    },
  ],
})
