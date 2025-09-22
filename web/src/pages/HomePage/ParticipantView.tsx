import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import CurrentEventCell from 'src/components/CurrentEventCell'
import ParticipationsCell from 'src/components/ParticipationsCell'
import PersonalDataCell from 'src/components/PersonalDataCell'
import { useSidebar } from 'src/layouts/SidebarLayout/SidebarLayout'

const ParticipantView = () => {
  const { currentUser } = useAuth()
  const { sidebarItem } = useSidebar()

  if (sidebarItem === 'Dashboard') {
    return (
      <>
        <Metadata title="Dashboard" />

        <section className="flex flex-col md:flex-row p-6 mx-auto lg:py-0 h-full mt-20 gap-2">
          <CurrentEventCell></CurrentEventCell>
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

        <PersonalDataCell />
      </>
    )
  }

  if (sidebarItem === 'Anmeldung') {
    return (
      <>
        <Metadata title="Anmeldung" />
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

export default ParticipantView
