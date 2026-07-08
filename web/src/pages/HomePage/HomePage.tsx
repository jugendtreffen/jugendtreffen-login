import { Metadata } from '@redwoodjs/web'

import SidebarLayout, {SidebarItem, useSidebar} from 'src/layouts/SidebarLayout/SidebarLayout'
import LandingPageView from '@/pages/HomePage/views/LandingPageView'
import { Skeleton } from '@/components/ui/skeleton'
import NavbarLayout from "@/layouts/NavbarLayout/NavbarLayout";
import {useAuth} from "@/auth";
import ViewRouter from "@/pages/HomePage/views/ViewRouter";

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
        <ViewRouter />
      </SidebarLayout>
    )
  }

  return (
    <NavbarLayout>
      <LandingPageView />
    </NavbarLayout>
  )
}

export default HomePage
