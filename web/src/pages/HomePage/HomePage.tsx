import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import LoadingSpinner from 'src/components/Loading/LoadingSpinner'
import DefaultView from 'src/pages/HomePage/DefaultView'
import MainConetntView from 'src/pages/HomePage/MainContentView'
import SidebarLayout from 'src/layouts/SidebarLayout/SidebarLayout'
import NavbarLayout from 'src/layouts/NavbarLayout/NavbarLayout'

const HomePage = () => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <>
        <Metadata title="Home" description="Home page" />
        <div className="flex flex-col items-center justify-center mt-20 w-full">
          <LoadingSpinner />
        </div>
      </>
    )
  }

  if (isAuthenticated) {
    return (
      <SidebarLayout>
        <MainConetntView />
      </SidebarLayout>
    )
  }

  return (
    <NavbarLayout>
      <DefaultView />
    </NavbarLayout>
  )
}

export default HomePage
