import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { getCurrentUser, hasRole, isAuthenticated, requireAuth } from './auth'

const callGetCurrentUser = (decoded) =>
  getCurrentUser(
    decoded,
    { token: 'token', type: 'supabase' },
    { event: {} as never, context: {} as never }
  )

describe('getCurrentUser', () => {
  it('returns null without a decoded token', async () => {
    expect(await callGetCurrentUser(null)).toBeNull()
  })

  it('maps the supabase user_role claim to roles', async () => {
    expect(
      await callGetCurrentUser({
        sub: 'user-1',
        email: 'anna@example.com',
        user_role: 'checkin',
      })
    ).toEqual({ id: 'user-1', email: 'anna@example.com', roles: ['checkin'] })
  })

  it('returns no roles when the claim is missing', async () => {
    const user = await callGetCurrentUser({ sub: 'user-1', email: 'a@b.at' })
    expect(user.roles).toEqual([])
  })
})

describe('isAuthenticated / hasRole', () => {
  it('is false without a current user', () => {
    mockCurrentUser(null)
    expect(isAuthenticated()).toBe(false)
    expect(hasRole('admin')).toBe(false)
  })

  it('checks single and multiple roles', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['checkin'] })

    expect(isAuthenticated()).toBe(true)
    expect(hasRole('checkin')).toBe(true)
    expect(hasRole('admin')).toBe(false)
    expect(hasRole(['admin', 'checkin'])).toBe(true)
    expect(hasRole(['admin', 'quartier_boys'])).toBe(false)
  })

  it('supports roles given as string', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: 'admin' as unknown as string[] })

    expect(hasRole('admin')).toBe(true)
    expect(hasRole(['checkin', 'admin'])).toBe(true)
  })
})

describe('requireAuth', () => {
  it('throws an AuthenticationError when logged out', () => {
    mockCurrentUser(null)
    expect(() => requireAuth()).toThrow(AuthenticationError)
  })

  it('throws a ForbiddenError when the role is missing', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['none'] })
    expect(() => requireAuth({ roles: ['admin'] })).toThrow(ForbiddenError)
  })

  it('passes for logged in users with a matching role', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['admin'] })
    expect(() => requireAuth()).not.toThrow()
    expect(() => requireAuth({ roles: ['admin', 'checkin'] })).not.toThrow()
  })
})
