import { getDirectiveName, mockRedwoodDirective } from '@redwoodjs/testing/api'

import requireAuth from './requireAuth'

describe('requireAuth directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(requireAuth.schema).toBeTruthy()
    expect(getDirectiveName(requireAuth.schema)).toBe('requireAuth')
  })

  it('throws when no user is logged in', () => {
    const mockExecution = mockRedwoodDirective(requireAuth, { context: {} })

    expect(mockExecution).toThrow("You don't have permission to do that.")
  })

  it('does not throw for a logged in user', () => {
    const mockExecution = mockRedwoodDirective(requireAuth, {
      context: { currentUser: { id: '1', email: 'a@b.at', roles: [] } },
    })

    expect(mockExecution).not.toThrow()
  })

  it('checks the roles given to the directive', () => {
    const currentUser = { id: '1', email: 'a@b.at', roles: ['checkin'] }

    expect(
      mockRedwoodDirective(requireAuth, {
        context: { currentUser },
        directiveArgs: { roles: ['admin'] },
      })
    ).toThrow("You don't have access to do that.")
    expect(
      mockRedwoodDirective(requireAuth, {
        context: { currentUser },
        directiveArgs: { roles: ['checkin'] },
      })
    ).not.toThrow()
  })
})
