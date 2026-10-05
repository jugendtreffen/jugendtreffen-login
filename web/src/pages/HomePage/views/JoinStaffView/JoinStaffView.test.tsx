import { render, screen } from '@redwoodjs/testing/web'

import JoinStaffView from './JoinStaffView'

const notStaffYet = 'Du bist noch nicht als Mitarbeiter aufgenommen!'

describe('JoinStaffView', () => {
  it.each([[['none']], [[]], [undefined]])(
    'asks users with roles %p to request access',
    (roles) => {
      mockCurrentUser({ id: '1', email: 'a@b.at', roles })
      render(<JoinStaffView />)

      expect(screen.getByText(notStaffYet)).toBeInTheDocument()
    }
  )

  it('does not show the hint to staff members', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['checkin'] })
    render(<JoinStaffView />)

    expect(screen.queryByText(notStaffYet)).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /info@jugendtreffen.at/ })
    ).toHaveAttribute('href', 'mailto:info@jugendtreffen.at')
  })
})
