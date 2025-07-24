import { fireEvent, render, screen } from '@testing-library/react'
import SignoutButton from 'src/components/Auth/SignoutButton'

jest.mock('@redwoodjs/router', () => ({
  navigate: jest.fn(),
  routes: { home: () => '/' },
}))

jest.mock('src/auth', () => ({
  useAuth: () => ({
    logOut: jest.fn(),
    loading: false,
  }),
}))

describe('SignoutButton', () => {
  it('calls logOut and navigates to home on click', async () => {
    const { logOut } = require('src/auth').useAuth()
    const { navigate, routes } = require('@redwoodjs/router')

    render(<SignoutButton />)

    const button = screen.getByText('Abmelden')
    expect(button).toBeEnabled()

    fireEvent.click(button)

    await Promise.resolve()

    expect(logOut).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith(routes.home())
  })

  it('disables button when loading is true', () => {
    jest.mocked(require('src/auth').useAuth).mockReturnValue({
      logOut: jest.fn(),
      loading: true,
    })
    render(<SignoutButton />)
    const button = screen.getByText('Abmelden')
    expect(button).toBeDisabled()
  })
})
