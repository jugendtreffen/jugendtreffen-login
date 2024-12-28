import { Link, routes } from "@redwoodjs/router";
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Card from 'src/components/Card/Card'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return (
    <>
      <Metadata title="Home" description="Home page" />
      {isAuthenticated ? (
        <div>
          <Card
            title={'Jugendtreffen 2025'}
            description={'Hier kann eine weitere Beschreibeung stehen'}
            button={{
              message: 'Teilnehmen',
              to: routes.events({id: '2025'}),
            }}
            imgSrc={'https://photos.app.goo.gl/6kQ4kDjUCM1YVCwS7'}
          ></Card>
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
