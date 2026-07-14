// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  quartierTable: {
    __typename: 'QuartierTable' as const,
    id: 42,
  },
})
