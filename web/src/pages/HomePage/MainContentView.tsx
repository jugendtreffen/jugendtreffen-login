import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { useSidebar } from 'src/layouts/SidebarLayout/SidebarLayout'

const MainContentView = () => {
  const { currentUser } = useAuth()
  const { sidebarItem } = useSidebar()

  console.log(currentUser)

  if (sidebarItem === 'Dashboard') {
    return (
      <>
        <Metadata title="Dashboard" />

        <section className="flex flex-col md:flex-row gap-2">
          <div className="md:ml-3"></div>
        </section>
      </>
    )
  }

  if (sidebarItem === 'Profil') {
    return (
      <>
        <Metadata title="Profil" />

        <section className="flex flex-col md:flex-row gap-2">
          <div className="md:ml-3"></div>
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
