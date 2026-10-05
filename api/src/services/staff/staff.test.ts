import { supabase } from 'src/lib/supabase'

import { staffUsers, updateStaffRole } from './staff'
import {
  ADMIN_ID,
  CHECKIN_ID,
  NEW_USER_ID,
  type StandardScenario,
} from './staff.scenarios'

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

const listUsers = supabase.auth.admin.listUsers as jest.Mock
const getUserById = supabase.auth.admin.getUserById as jest.Mock

const authUsers = [
  { id: ADMIN_ID, email: 'admin@example.com' },
  { id: CHECKIN_ID, email: 'checkin@example.com' },
  { id: NEW_USER_ID, email: undefined },
]

describe('staff', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCurrentUser({ id: ADMIN_ID, email: 'admin@example.com', roles: ['admin'] })
    listUsers.mockResolvedValue({ data: { users: authUsers }, error: null })
    getUserById.mockImplementation(async (id: string) => ({
      data: { user: authUsers.find((u) => u.id === id) },
      error: null,
    }))
  })

  describe('staffUsers', () => {
    scenario(
      'lists all other users with their role',
      async (_scenario: StandardScenario) => {
        const result = await staffUsers()

        expect(result).toEqual([
          { id: CHECKIN_ID, email: 'checkin@example.com', role: 'checkin' },
          { id: NEW_USER_ID, email: '', role: 'none' },
        ])
      }
    )

    scenario('is forbidden for non admins', async () => {
      mockCurrentUser({ id: CHECKIN_ID, email: 'c@example.com', roles: ['checkin'] })

      await expect(staffUsers()).rejects.toThrow("You don't have access to do that.")
      expect(listUsers).not.toHaveBeenCalled()
    })

    scenario('reports supabase errors', async () => {
      listUsers.mockResolvedValue({ data: null, error: { message: 'kaputt' } })

      await expect(staffUsers()).rejects.toThrow(
        'Fehler beim Laden der Benutzer: kaputt'
      )
    })
  })

  describe('updateStaffRole', () => {
    scenario('assigns a new role', async () => {
      const result = await updateStaffRole({
        input: { userId: NEW_USER_ID, role: 'quartier_girls' },
      })

      expect(result).toEqual({
        id: NEW_USER_ID,
        email: undefined,
        role: 'quartier_girls',
      })
    })

    scenario('creates the role entry if the user has none yet', async () => {
      const userId = '44444444-4444-4444-8444-444444444444'
      getUserById.mockResolvedValue({
        data: { user: { id: userId, email: 'neu@example.com' } },
        error: null,
      })

      const result = await updateStaffRole({ input: { userId, role: 'checkin' } })

      expect(result).toEqual({ id: userId, email: 'neu@example.com', role: 'checkin' })
    })

    scenario('removes the role when null is sent', async () => {
      const result = await updateStaffRole({
        input: { userId: CHECKIN_ID, role: null },
      })

      expect(result.role).toEqual('none')
    })

    scenario('rejects unknown roles', async () => {
      await expect(
        updateStaffRole({ input: { userId: CHECKIN_ID, role: 'superuser' } })
      ).rejects.toThrow('Fehler beim Aktualisieren der Rolle')
    })

    scenario('is forbidden for non admins', async () => {
      mockCurrentUser({ id: CHECKIN_ID, email: 'c@example.com', roles: ['checkin'] })

      await expect(
        updateStaffRole({ input: { userId: CHECKIN_ID, role: 'admin' } })
      ).rejects.toThrow("You don't have access to do that.")
    })
  })
})
