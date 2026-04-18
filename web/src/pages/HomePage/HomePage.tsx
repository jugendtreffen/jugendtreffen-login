import { Metadata } from '@redwoodjs/web'

import SidebarLayout from 'src/layouts/SidebarLayout/SidebarLayout'
import DefaultView from 'src/pages/HomePage/DefaultView'
import MainConetntView from 'src/pages/HomePage/MainContentView'
import { Skeleton } from '@/components/ui/skeleton'
import NavbarLayout from "@/layouts/NavbarLayout/NavbarLayout";
import {useAuth} from "@/auth";

const HomePage = () => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <>
        <Metadata title="Home" description="Home page" />
        <div className="flex flex-col items-center justify-center mt-20 w-full">
          <div className="flex w-full max-w-xl flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
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
