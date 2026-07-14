import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Home,
  LaptopMinimalCheck,
  LayoutDashboard,
  LogOut,
  UserPen,
  UserStar,
} from 'lucide-react'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { useAlert } from '@/hooks/AlertHook'
import { Button } from '@/components/ui/button'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export type SidebarItem =
  | 'Dashboard'
  | 'Quartier'
  | 'Checkin'
  | 'Join the Team'
  | 'Mitarbeiter'

interface SidebarContextType {
  sidebarItem: SidebarItem
  setSidebarItem: (item: SidebarItem) => void
  subState: string | null
  setSubState: (state: string | null) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within SidebarLayout')
  }
  return context
}

function getSidebarItemsByRole(role: string) {
  const items: { name: SidebarItem; icon: React.ComponentType<{ className?: string }> }[] = [
    { name: 'Join the Team', icon: UserStar },
  ]
  switch (role) {
    case 'admin':
      items.push({ name: 'Dashboard', icon: LayoutDashboard })
      items.push({ name: 'Mitarbeiter', icon: UserPen })
      items.push({ name: 'Checkin', icon: LaptopMinimalCheck })
      items.push({ name: 'Quartier', icon: Home })
      break
    case 'checkin':
      items.push({ name: 'Checkin', icon: LaptopMinimalCheck })
      break
    case 'quartier':
      items.push({ name: 'Quartier', icon: Home })
      break
  }
  return items
}

type SidebarLayoutProps = {
  children?: React.ReactNode
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState<SidebarItem>(() => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem('activeSidebarItem')
      : null

    return (saved as SidebarItem) ?? 'Join the Team'
  })

  const [subState, setSubState] = useState<string | null>(null)

  const { logOut, loading, currentUser } = useAuth()
  const { addAlert } = useAlert()

  const sidebarItems = getSidebarItemsByRole(currentUser?.roles?.at(0) || 'none')

  useEffect(() => {
    localStorage.setItem('activeSidebarItem', activeSidebarItem)
  }, [activeSidebarItem])

  return (
    <SidebarContext.Provider
      value={{
        sidebarItem: activeSidebarItem,
        setSidebarItem: setActiveSidebarItem,
        subState,
        setSubState,
      }}
    >
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-screen overflow-hidden">
          <Sidebar collapsible="icon" variant="sidebar" side="left">
            <SidebarHeader className="border-b">
              <div className="flex items-center gap-2 px-2 py-1">
                <img
                  src="/Jugendtreffen-Logo-2.png"
                  className="h-8 w-auto"
                  alt="Jugendtreffen"
                />
                <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
                  Jugendtreffen
                </span>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map(({ name, icon: Icon }) => (
                      <SidebarMenuItem key={name}>
                        <SidebarMenuButton
                          isActive={activeSidebarItem === name}
                          tooltip={name}
                          onClick={() => {
                            setActiveSidebarItem(name)
                            setSubState(null)
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
              <SidebarMenu>
                <SidebarMenuItem>
                  <Button
                    className="w-full"
                    onClick={() => {
                      logOut().catch(() => {
                        addAlert('Fehler beim Abmelden', 'error')
                      })
                      navigate(routes.home())
                    }}
                    disabled={loading}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Abmelden</span>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="min-w-0 overflow-hidden md:left-44">
            <header className="flex h-14 items-center border-b px-4">
              <SidebarTrigger className="md:hidden" />
            </header>
            <main className="h-[calc(100vh-3.5rem)] md:w-[calc(100vw-11rem)] overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SidebarContext.Provider>
  )
}

export default SidebarLayout
