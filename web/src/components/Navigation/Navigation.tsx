import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import SignoutButton from 'src/components/Auth/signoutButton'

const Navigation = () => {
  const { isAuthenticated } = useAuth()

  return (
    <nav>
      {isAuthenticated ? (
        <SignoutButton />
      ) : (
        <>
          <Link to={routes.signup()}>Sign Up</Link>
          <Link to={routes.login()}>Sign In</Link>
        </>
      )}
    </nav>
  )
}

export default Navigation
