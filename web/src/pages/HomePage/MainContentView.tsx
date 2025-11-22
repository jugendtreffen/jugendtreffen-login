import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ParticipationsCell from 'src/components/ParticipationsCell'
import PersonalDataCell from 'src/components/PersonalDataCell'
import { useSidebar } from 'src/layouts/SidebarLayout/SidebarLayout'
import EventParticipationForm from 'src/components/EventParticipationForm/EventParticipationForm'

const MainContentView = () => {
  const { currentUser } = useAuth()
  const { sidebarItem } = useSidebar()

  if (sidebarItem === 'Dashboard') {
    return (
      <>
        <Metadata title="Dashboard" />

        <section className="flex flex-col md:flex-row gap-2">
          <div className="md:ml-3">
            <ParticipationsCell userId={currentUser.sub}></ParticipationsCell>
          </div>
        </section>
      </>
    )
  }

  if (sidebarItem === 'Profil') {
    return (
      <>
        <Metadata title="Profil" />

        <section className="flex flex-col md:flex-row gap-2">
          <div className="md:ml-3">
            <PersonalDataCell />
          </div>
        </section>
      </>
    )
  }

  if (sidebarItem === 'Anmeldung') {
    return (
      <>
        <Metadata title="Anmeldung" />

        <section className="flex flex-col md:flex-row gap-2">
          <div className="md:ml-3">
            <EventParticipationForm></EventParticipationForm>
          </div>
        </section>
      </>
    )
  }

  if (sidebarItem === 'Quartier') {
    return (
      <>
        <Metadata title="Quartier" />
      </>
    )
  }
  return null
}

export default MainContentView
