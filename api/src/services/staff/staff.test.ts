import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { supabase } from 'src/lib/supabase'
import { staffUsers, updateStaffRole } from './staff'

jest.mock('src/lib/auth', () => ({
  requireAuth: jest.fn(),
}))

jest.mock('src/lib/supabase', () => ({
  supabase: {
    auth: {
      admin: {
        listUsers: jest.fn(),
        getUserById: jest.fn(),
      },
    },
  },
}))

jest.mock('src/lib/db', () => ({
  db: {
    userRole: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}))

describe('staff', () => {
  beforeEach(() => {
    ;(globalThis as any).context = {
      currentUser: {
        id: 'current-user-id',
        email: 'admin@example.com',
        roles: ['admin'],
      },
    }
    jest.clearAllMocks()
  })

  it('returns staff users without the current user and includes their roles', async () => {
    const mockedListUsers = jest.mocked(supabase.auth.admin.listUsers)
    const mockedFindMany = jest.mocked(db.userRole.findMany)

    mockedListUsers.mockResolvedValue({
      data: {
        users: [
          { id: 'current-user-id', email: 'admin@example.com' },
          { id: 'user-1', email: 'first@example.com' },
          { id: 'user-2', email: 'second@example.com' },
        ],
      },
      error: null,
    } as any)

    mockedFindMany.mockResolvedValue([
      { userId: 'user-1', role: 'checkin' },
      { userId: 'user-2', role: 'admin' },
    ] as any)

    const result = await staffUsers()

    expect(requireAuth).toHaveBeenCalledWith({ roles: ['admin'] })
    expect(result).toEqual([
      {
        id: 'user-1',
        email: 'first@example.com',
        role: 'checkin',
      },
      {
        id: 'user-2',
        email: 'second@example.com',
        role: 'admin',
      },
    ])
  })

  it('updates a staff role and returns the updated user details', async () => {
    const mockedUpdate = jest.mocked(db.userRole.update)
    const mockedGetUserById = jest.mocked(supabase.auth.admin.getUserById)

    mockedUpdate.mockResolvedValue({
      userId: 'user-1',
      role: 'checkin',
    } as any)

    mockedGetUserById.mockResolvedValue({
      data: {
        user: { email: 'first@example.com' },
      },
      error: null,
    } as any)

    const result = await updateStaffRole({
      input: {
        userId: 'user-1',
        role: 'checkin',
      },
    })

    expect(requireAuth).toHaveBeenCalledWith({ roles: ['admin'] })
    expect(mockedUpdate).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      data: { role: 'checkin' },
    })
    expect(result).toEqual({
      id: 'user-1',
      email: 'first@example.com',
      role: 'checkin',
    })
  })
})
