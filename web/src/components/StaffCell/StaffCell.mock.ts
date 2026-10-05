// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  staffUsers: [
    {
      __typename: 'StaffUser' as const,
      id: 'u1',
      email: 'anna@example.com',
      role: 'admin',
    },
    {
      __typename: 'StaffUser' as const,
      id: 'u2',
      email: 'ben@example.com',
      role: null,
    },
  ],
})
