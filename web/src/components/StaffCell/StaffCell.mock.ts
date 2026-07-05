// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  staff: {
    __typename: 'Staff' as const,
    id: 42,
  },
})
