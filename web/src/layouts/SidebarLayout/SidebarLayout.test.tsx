import { fireEvent, render, screen } from '@redwoodjs/testing/web'

import { AlertProvider } from '@/hooks/AlertHook'

import SidebarLayout, { useSidebar } from './SidebarLayout'

const ActiveItem = () => {
  const { sidebarItem } = useSidebar()
  return <p data-testid="active-item">{sidebarItem}</p>
}

const renderLayout = () =>
  render(
    <AlertProvider>
      <SidebarLayout>
        <ActiveItem />
      </SidebarLayout>
    </AlertProvider>
  )

const menuButton = (name: string) =>
  screen.getByRole('button', { name: new RegExp(`^${name}$`) })

describe('SidebarLayout', () => {
  it('renders successfully', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: [] })
    expect(() => renderLayout()).not.toThrow()
  })

  it('shows only "Join the Team" for users without role', async () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['none'] })
    renderLayout()

    expect(await screen.findByRole('button', { name: 'Join the Team' })).toBeInTheDocument()
    expect(screen.queryByText('Checkin')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Quartier')).not.toBeInTheDocument()
  })

  it('shows admin, staff and checkin items for admins', async () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['admin'] })
    renderLayout()

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Mitarbeiter')).toBeInTheDocument()
    expect(screen.getByText('Checkin')).toBeInTheDocument()
    expect(screen.queryByText('Quartier')).not.toBeInTheDocument()
  })

  it('shows checkin item for checkin role', async () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['checkin'] })
    renderLayout()

    expect(await screen.findByText('Checkin')).toBeInTheDocument()
    expect(screen.queryByText('Mitarbeiter')).not.toBeInTheDocument()
  })

  it.each(['quartier_boys', 'quartier_girls'])(
    'shows quartier item for %s',
    async (role) => {
      mockCurrentUser({ id: '1', email: 'a@b.at', roles: [role] })
      renderLayout()

      expect(await screen.findByText('Quartier')).toBeInTheDocument()
      expect(screen.queryByText('Checkin')).not.toBeInTheDocument()
    }
  )

  it('switches and persists the active item', async () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['admin'] })
    renderLayout()

    expect(screen.getByTestId('active-item')).toHaveTextContent(
      'Join the Team'
    )
    fireEvent.click(await screen.findByText('Checkin'))

    expect(screen.getByTestId('active-item')).toHaveTextContent('Checkin')
    expect(localStorage.getItem('activeSidebarItem')).toBe('Checkin')
    expect(menuButton('Checkin')).toHaveAttribute('data-active', 'true')
  })

  it('restores the active item from localStorage', () => {
    localStorage.setItem('activeSidebarItem', 'Mitarbeiter')
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: ['admin'] })
    renderLayout()

    expect(screen.getByTestId('active-item')).toHaveTextContent('Mitarbeiter')
  })

  it('shows an enabled logout button', () => {
    mockCurrentUser({ id: '1', email: 'a@b.at', roles: [] })
    renderLayout()

    const logoutBtn = screen.getByRole('button', { name: 'Abmelden' })
    expect(logoutBtn).toBeEnabled()
  })
})
