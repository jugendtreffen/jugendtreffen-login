import { fireEvent, render, screen } from '@redwoodjs/testing/web'

import StaffRoleForm from './StaffRoleForm'

const user = { id: 'u1', email: 'anna@example.com', role: 'checkin' }

const selectRole = (label: string) => {
  fireEvent.click(screen.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: label }))
}

describe('StaffRoleForm', () => {
  it('shows the user and the current role', () => {
    render(<StaffRoleForm user={user} onRoleChange={jest.fn()} isSaving={false} />)

    expect(screen.getByText('anna@example.com')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveTextContent('Check-in')
  })

  it('disables saving until the role changes', () => {
    render(<StaffRoleForm user={user} onRoleChange={jest.fn()} isSaving={false} />)
    expect(screen.getByTitle('Speichern')).toBeDisabled()

    selectRole('Admin')
    expect(screen.getByTitle('Speichern')).toBeEnabled()
  })

  it('calls onRoleChange with the selected role', () => {
    const onRoleChange = jest.fn()
    render(<StaffRoleForm user={user} onRoleChange={onRoleChange} isSaving={false} />)

    selectRole('Quartier Mädchen')
    fireEvent.click(screen.getByTitle('Speichern'))

    expect(onRoleChange).toHaveBeenCalledWith('u1', 'quartier_girls')
  })

  it('sends null when "Keine Rolle" is selected', () => {
    const onRoleChange = jest.fn()
    render(<StaffRoleForm user={user} onRoleChange={onRoleChange} isSaving={false} />)

    selectRole('Keine Rolle')
    fireEvent.click(screen.getByTitle('Speichern'))

    expect(onRoleChange).toHaveBeenCalledWith('u1', null)
  })

  it('disables saving while a save is in progress', () => {
    render(<StaffRoleForm user={user} onRoleChange={jest.fn()} isSaving />)
    selectRole('Admin')
    expect(screen.getByTitle('Speichern')).toBeDisabled()
  })
})
