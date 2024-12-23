import { Link } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import routes from 'src/Routes'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return (
    <>
      <Metadata title="Home" description="Home page" />
      {isAuthenticated ? (
        <div>
          <button>Jugendtreffen 2024</button>
        </div>
      ) : (
        <div>
          <p>Banner Text + Picture for Jugendtreffen</p>

          <Link className="link" to="/signup">
            Sign up
          </Link>
        </div>
      )}
    </>
  )
}

export default HomePage
