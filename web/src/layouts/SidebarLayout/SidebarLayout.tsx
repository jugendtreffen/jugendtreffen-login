import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  LaptopMinimalCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserPen, UserStar,
  X,
} from 'lucide-react'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { useAlert } from '@/hooks/AlertHook'
import { isMobile, useForceUpdate } from 'src/lib/utils'
import {Button} from "@/components/ui/button";

export type SidebarItem = 'Dashboard' | 'Quartier' | 'Checkin' | 'Join the Team' | 'Mitarbeiter'

interface SidebarContextType {
  sidebarItem: SidebarItem
  setSidebarItem: (item: SidebarItem) => void
  subState: string | null
  setSubState: (state: string | null) => void
}
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context)
    throw new Error('useSidebarContext must be used within SidebarLayout')
  return context
}

function getSidebarItemsByRole(role: string) {
  const items = [
    { name: 'Join the Team', icon: UserStar },
  ]
  switch (role) {
    case 'admin':
      items.push({ name: 'Dashboard', icon: LayoutDashboard },)
      items.push({ name: 'Mitarbeiter', icon: UserPen },)
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
  const [open, setOpen] = useState(!isMobile())
  const [expanded, setExpanded] = useState(true)
  const [activeSidebarItem, setActiveSidebarItem] = useState(() => {
    const saved = localStorage.getItem("activeSidebarItem");
    return (saved as SidebarItem) ?? "Join the Team";
  })
  const [subState, setSubState] = useState(null)
  const { logOut, loading } = useAuth()
  const { addAlert } = useAlert()
  const { currentUser } = useAuth()
  const forceUpdate = useForceUpdate()

  const sidebarItems = getSidebarItemsByRole(currentUser.roles.at(0) || 'none')

  const getWidthByState = () => {
    return open ? (expanded ? 240 : 72) : 0
  }

  useEffect(() => {
    const handleResiize = () => {
      if (isMobile()) setExpanded(false)
      forceUpdate()
    }
    localStorage.setItem('activeSidebarItem', activeSidebarItem)

    window.addEventListener('resize', handleResiize)
    return () => window.removeEventListener('resize', handleResiize)
  })

  return (
    <SidebarContext.Provider
      value={{ sidebarItem: activeSidebarItem, setSidebarItem: setActiveSidebarItem, subState: subState, setSubState: setSubState }}
    >
      <div className="flex flex-col h-screen w-screen">
        <div className="flex md:hidden w-full bg-gray-900 text-white p-4 items-center justify-between border-gray-600 border-b">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold">
            Jugendtreffen
            <img
              src="/Jugendtreffen-Logo-2.png"
              className="ml-2 h-8"
              alt="Jugendtreffen"
            />
          </h1>
        </div>

        <div className="flex h-full w-screen">
          <motion.aside
            animate={{ width: getWidthByState() }}
            className={`sticky top-0 h-screen flex flex-col ${
              open ? 'border-r' : ''
            } border-gray-600 shadow-md transition-all overflow-hidden`}
          >
            {!isMobile() && (
              <div className="flex items-center justify-between p-4">
                {expanded && (
                  <motion.h2
                    animate={{ display: expanded ? 'inline-block' : 'none' }}
                    className="text-xl font-bold"
                  >
                    Jugendtreffen
                  </motion.h2>
                )}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className={`ml-auto ${!expanded ? 'mx-auto' : ''}`}
                >
                  {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
                </button>
              </div>
            )}

            <nav className="flex flex-1 flex-col gap-2 p-2">
              {sidebarItems.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  title={name}
                  onClick={() => setActiveSidebarItem(name)}
                  className={`flex items-center rounded-xl px-3 py-2 text-gray-300 hover:bg-gray-700 focus:outline-none ${
                    expanded ? 'gap-3 justify-start' : 'justify-center'
                  } ${activeSidebarItem === name ? 'bg-gray-700 font-bold' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  {expanded && <span>{name}</span>}
                </button>
              ))}
            </nav>

            <div className="p-2">
              <Button
                title="Abmelden"
                onClick={() => {
                  logOut().catch(() => {
                    addAlert('Fehler beim Abmelden', 'error')
                  })
                  navigate(routes.home())
                }}
                disabled={loading}
                className="w-full"
              >
                <LogOut className="h-5 w-5" />
                {expanded && <span>Abmelden</span>}
              </Button>
            </div>
          </motion.aside>

          <div
            className="h-full w-full flex flex-col overflow-auto"
            onClick={() => {
              if (isMobile()) setOpen(false)
            }}
          >
            <main className="flex-1 overflow-visible p-6">{children}</main>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export default SidebarLayout
