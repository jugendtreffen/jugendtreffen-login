import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import CurrentEventCell from 'src/components/CurrentEventCell'
import ParticipationsCell from 'src/components/ParticipationsCell'

const ParticipantView = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <Metadata title="Dashboard" description="Home Page" />

      <section className="flex flex-col md:flex-row p-6 mx-auto lg:py-0 h-full mt-20 gap-2">
        <CurrentEventCell></CurrentEventCell>
        <div className="md:ml-3">
          <ParticipationsCell userId={currentUser.sub}></ParticipationsCell>
        </div>
      </section>
    </>
  )
}

export default ParticipantView
