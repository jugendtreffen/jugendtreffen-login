jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'mock-user-id', email: 'mock@example.com' } },
          error: null,
        }),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn(),
        update: jest.fn(),
      }),
    }),
  }
})
