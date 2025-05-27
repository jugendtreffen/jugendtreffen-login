// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  currentEvent: {
    __typename: "CurrentEvent" as const,
    id: 42
  }
});
