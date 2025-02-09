import { Link } from "@redwoodjs/router";
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import EventsCell from 'src/components/EventsCell'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Metadata title="Home" description="Home page" />
      {isAuthenticated ? (
        <EventsCell></EventsCell>
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
