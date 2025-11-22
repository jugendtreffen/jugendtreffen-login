import { fireEvent, render, screen } from '@redwoodjs/testing/web'
import SidebarLayout from './SidebarLayout'

describe('SidebarLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SidebarLayout />)
    }).not.toThrow()
  })

  it('shows sidebar items', () => {
    render(<SidebarLayout />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('Anmeldung')).toBeInTheDocument()
    expect(screen.getByText('Quartier')).toBeInTheDocument()
  })

  it('toggles sidebar open/close', () => {
    render(<SidebarLayout />)
    const toggleBtn = screen.getByRole('button', { name: /panel/i })
    fireEvent.click(toggleBtn)
    // After closing, the sidebar title should not be visible
    expect(screen.queryByText('Jugendtreffen')).not.toBeInTheDocument()
    fireEvent.click(toggleBtn)
    expect(screen.getByText('Jugendtreffen')).toBeInTheDocument()
  })

  it('selects sidebar item', () => {
    render(<SidebarLayout />)
    const profilBtn = screen.getByRole('button', { name: 'Profil' })
    fireEvent.click(profilBtn)
    expect(profilBtn).toHaveClass('bg-gray-700')
  })

  it('shows and enables logout button', () => {
    render(<SidebarLayout />)
    const logoutBtn = screen.getByRole('button', { name: 'Abmelden' })
    expect(logoutBtn).toBeInTheDocument()
    expect(logoutBtn).not.toBeDisabled()
  })
})
